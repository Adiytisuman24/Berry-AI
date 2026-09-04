import os
import json
import logging
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("berry-py-agent")

app = FastAPI(
    title="Berry AI Python Agent Service",
    description="Agentic reasoning, intent extraction, tool calling & merchant growth optimization",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
openai_client = None

if OPENAI_API_KEY and not OPENAI_API_KEY.startswith("sk-demo"):
    try:
        from openai import OpenAI
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        logger.info("⚡ OpenAI Client successfully initialized with live API key!")
    except Exception as e:
        logger.warning(f"Could not initialize OpenAI client: {e}")

# ----------------- Data Models -----------------

class IntentRequest(BaseModel):
    query: str
    user_context: Optional[Dict[str, Any]] = None

class IntentResponse(BaseModel):
    category: str
    max_price: float
    intent_summary: str
    experience_level: Optional[str] = "beginner"
    attributes: List[str] = []
    confidence: float

class VisionAnalyzeRequest(BaseModel):
    image_data: Optional[str] = None # Base64 or URL
    query: Optional[str] = "Find me something like this"
    budget: Optional[float] = None
    refinement: Optional[str] = None
    previous_context: Optional[Dict[str, Any]] = None

class VisionIntentResponse(BaseModel):
    category: str
    detected_summary: str
    visual_attributes: List[str]
    use_case: str
    style: str
    budget: float
    confidence: float
    refinement_applied: Optional[str] = None

class ProductCandidate(BaseModel):
    id: str
    name: str
    price: float
    category: str
    brand: str
    rating: float
    description: str
    match_score: Optional[int] = None
    reasoning: Optional[str] = None
    image_url: Optional[str] = None

class EvaluationRequest(BaseModel):
    query: str
    budget_limit: float
    products: List[ProductCandidate]

class EvaluationResponse(BaseModel):
    total_evaluated: int
    top_picks: List[ProductCandidate]
    recommended_product_id: str
    recommendation_summary: str
    reasoning_points: List[str]

class CrossSellRequest(BaseModel):
    primary_product_id: str
    primary_product_name: str
    current_cart_total: float
    purchase_limit: float

class CrossSellItem(BaseModel):
    id: str
    name: str
    price: float
    category: str
    attach_rate_pct: int
    pitch: str
    can_fit_in_budget: bool

class MerchantPromptRequest(BaseModel):
    prompt: str

class MerchantConfigResponse(BaseModel):
    business_type: str
    readiness_score: int
    catalog_status: str
    products_indexed: int
    inventory_synced: bool
    pricing_guardrail: Dict[str, Any]
    recommendations_enabled: bool
    cross_sell_enabled: bool
    payment_provider: str
    customer_approval_required: bool
    ai_readiness_summary: str

class OpportunityItem(BaseModel):
    id: str
    title: str
    type: str
    acceptance_rate: Optional[str] = None
    estimated_revenue_inr: float
    description: str
    action_label: str

# ----------------- Endpoints -----------------

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "berry-python-agent",
        "openai_configured": bool(openai_client is not None),
        "model": "gpt-4o-mini",
    }

@app.post("/agent/vision-intent", response_model=VisionIntentResponse)
def analyze_vision_intent(req: VisionAnalyzeRequest):
    logger.info(f"Analyzing vision intent with query: {req.query}, has_image: {bool(req.image_data)}")

    # Default fallback structured visual intent
    budget = req.budget or 5000.0
    if req.query:
        q_lower = req.query.lower()
        if "5,000" in q_lower or "5000" in q_lower or "5k" in q_lower:
            budget = 5000.0
        elif "7,000" in q_lower or "7000" in q_lower or "7k" in q_lower:
            budget = 7000.0
        elif "4,000" in q_lower or "4000" in q_lower or "4k" in q_lower:
            budget = 4000.0
        elif "10,000" in q_lower or "10000" in q_lower or "10k" in q_lower:
            budget = 10000.0
        elif "40,000" in q_lower or "40000" in q_lower or "40k" in q_lower:
            budget = 40000.0

    if openai_client and req.image_data:
        try:
            # Construct multimodal payload for OpenAI
            image_url_payload = req.image_data
            if not req.image_data.startswith("http") and not req.image_data.startswith("data:image"):
                image_url_payload = f"data:image/jpeg;base64,{req.image_data}"

            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are Berry's visual shopping reasoning engine. Analyze the product in the image. "
                        "Do NOT invent fictional product names or stores. Extract pure visual & commerce intent as JSON: "
                        "category (e.g. running_shoes, dress, sofa, jacket, watch), "
                        "detected_summary (concise 1-sentence description of the visual item), "
                        "visual_attributes (list of strings, e.g. ['black', 'low-top', 'mesh upper', 'white foam midsole']), "
                        "use_case (e.g. daily_running, evening_wear, living_room), "
                        "style (e.g. minimal, sporty, modern, vintage), "
                        "budget (numeric in INR), "
                        "confidence (float 0.0-1.0)."
                    )
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"User request: {req.query or 'Find me something like this'}. Refinement: {req.refinement or 'None'}. Budget target: ₹{budget:,.0f}"},
                        {"type": "image_url", "image_url": {"url": image_url_payload, "detail": "low"}}
                    ]
                }
            ]

            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                response_format={"type": "json_object"},
                max_tokens=500
            )

            raw = json.loads(response.choices[0].message.content)
            return VisionIntentResponse(
                category=raw.get("category", "running_shoes"),
                detected_summary=raw.get("detected_summary", "Black low-top athletic shoe with breathable mesh and responsive white midsole"),
                visual_attributes=raw.get("visual_attributes", ["black", "white_midsole", "low_top", "mesh_upper", "minimal_logo"]),
                use_case=raw.get("use_case", "daily_running"),
                style=raw.get("style", "sporty minimal"),
                budget=float(raw.get("budget", budget)),
                confidence=float(raw.get("confidence", 0.96)),
                refinement_applied=req.refinement
            )
        except Exception as e:
            logger.warning(f"OpenAI vision inference fallback: {e}")

    # Fallback heuristic analysis based on query / default shoe demo
    query_str = (req.query or "").lower()
    category = "running_shoes"
    use_case = "daily_running"
    style = "sporty minimal"
    visual_attrs = ["black", "white_midsole", "low_top", "mesh_upper", "minimal_logo"]
    detected_summary = "Black low-top athletic runner with breathable mesh upper and lightweight white foam sole"

    if "dress" in query_str or "outfit" in query_str or "cloth" in query_str:
        category = "apparel"
        use_case = "evening_wear"
        style = "minimal elegant"
        visual_attrs = ["black", "midi length", "sleeveless", "tailored silhouette"]
        detected_summary = "Minimal black evening midi dress with clean tailored silhouette"
    elif "sofa" in query_str or "couch" in query_str or "furniture" in query_str:
        category = "furniture"
        use_case = "living_room"
        style = "modern nordic"
        visual_attrs = ["beige", "velvet texture", "3-seater", "wooden tapered legs"]
        detected_summary = "Contemporary 3-seater living room sofa in warm beige textured fabric"

    if req.refinement:
        visual_attrs.append(req.refinement)
        detected_summary += f" [Refined: {req.refinement}]"

    return VisionIntentResponse(
        category=category,
        detected_summary=detected_summary,
        visual_attributes=visual_attrs,
        use_case=use_case,
        style=style,
        budget=budget,
        confidence=0.95,
        refinement_applied=req.refinement
    )

@app.post("/agent/intent", response_model=IntentResponse)
def parse_intent(req: IntentRequest):
    logger.info(f"Extracting intent from query: {req.query}")

    # If live OpenAI client is available, extract intent via structured LLM prompt
    if openai_client:
        try:
            prompt = f"""
            Analyze the following buyer purchasing intent:
            "{req.query}"

            Extract as JSON:
            - category: string
            - max_price: float (in INR)
            - intent_summary: string
            - experience_level: string (beginner, intermediate, advanced)
            - attributes: list of key attributes
            - confidence: float (0.0 to 1.0)
            """
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are Berry AI intent extraction engine. Output valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            raw = json.loads(response.choices[0].message.content)
            return IntentResponse(
                category=raw.get("category", "running shoes"),
                max_price=float(raw.get("max_price", 7000.0)),
                intent_summary=raw.get("intent_summary", f"Searching for {raw.get('category', 'running shoes')} under ₹{raw.get('max_price', 7000):,.0f}"),
                experience_level=raw.get("experience_level", "beginner"),
                attributes=raw.get("attributes", ["cushioning", "daily road training"]),
                confidence=float(raw.get("confidence", 0.98)),
            )
        except Exception as err:
            logger.warning(f"OpenAI call error, falling back to rule engine: {err}")

    # Fallback rule-based parsing
    text = req.query.lower()
    max_price = 7000.0
    if "7,000" in text or "7000" in text or "7k" in text:
        max_price = 7000.0
    elif "5,000" in text or "5000" in text or "5k" in text:
        max_price = 5000.0
    elif "10,000" in text or "10000" in text or "10k" in text:
        max_price = 10000.0

    category = "running shoes"
    if "shoe" in text or "sneaker" in text or "running" in text:
        category = "running shoes"
    elif "headphone" in text or "audio" in text or "earbud" in text:
        category = "electronics"
    elif "watch" in text or "fitness" in text:
        category = "fitness"

    return IntentResponse(
        category=category,
        max_price=max_price,
        intent_summary=f"Searching for top-rated {category} under ₹{max_price:,.0f} optimized for beginner level.",
        experience_level="beginner",
        attributes=["cushioning", "daily road training", "breathability", "durability"],
        confidence=0.96,
    )

@app.post("/agent/evaluate", response_model=EvaluationResponse)
def evaluate_products(req: EvaluationRequest):
    logger.info(f"Evaluating {len(req.products)} products against budget ₹{req.budget_limit}")

    candidates = req.products
    if not candidates:
        candidates = [
            ProductCandidate(
                id="prod-nimbus",
                name="Nimbus Runner",
                price=6499.0,
                category="running shoes",
                brand="AeroStride",
                rating=4.9,
                description="Engineered plush daily training shoe with dynamic responsive foam.",
                match_score=94,
                reasoning="Optimal balance of cushioning and stability for beginner runners within ₹7,000 limit.",
                image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
            ),
            ProductCandidate(
                id="prod-aeroflex",
                name="AeroFlex Daily",
                price=5999.0,
                category="running shoes",
                brand="Pulse",
                rating=4.7,
                description="Lightweight everyday road runner with reinforced breathable mesh.",
                match_score=89,
                reasoning="Great value lightweight trainer, slightly firmer ride than Nimbus Runner.",
                image_url="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&auto=format&fit=crop&q=80",
            ),
            ProductCandidate(
                id="prod-motionlite",
                name="Motion Lite",
                price=4899.0,
                category="running shoes",
                brand="Velocity",
                rating=4.5,
                description="Budget-friendly responsive cushioned shoe for light training.",
                match_score=83,
                reasoning="Solid budget option under ₹5,000 with essential shock absorption.",
                image_url="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80",
            ),
        ]

    return EvaluationResponse(
        total_evaluated=14,
        top_picks=candidates[:3],
        recommended_product_id=candidates[0].id,
        recommendation_summary="Nimbus Runner is the strongest match because it's engineered for daily training and stays comfortably within your ₹7,000 purchase boundary.",
        reasoning_points=[
            "Engineered specifically for beginner and daily training road use.",
            "Stays strictly within authorized per-purchase boundary (₹6,499 vs ₹7,000).",
            "High verified merchant inventory with 99.4% dispatch reliability.",
            "High customer satisfaction rating (4.9/5 from 1,280 runners).",
        ],
    )

@app.post("/agent/cross-sell", response_model=CrossSellItem)
def get_cross_sell(req: CrossSellRequest):
    item_price = 499.0
    fits = (req.current_cart_total + item_price) <= req.purchase_limit

    return CrossSellItem(
        id="cross-socks-01",
        name="Performance Anti-Blister Socks",
        price=item_price,
        category="accessories",
        attach_rate_pct=31,
        pitch="Performance socks are frequently purchased with Nimbus Runner to prevent friction blisters during daily 5K runs.",
        can_fit_in_budget=fits,
    )

@app.post("/merchant/onboard-prompt", response_model=MerchantConfigResponse)
def parse_merchant_prompt(req: MerchantPromptRequest):
    logger.info(f"Parsing merchant onboarding prompt: {req.prompt}")

    if openai_client:
        try:
            prompt = f"""
            Analyze merchant store integration prompt:
            "{req.prompt}"

            Translate into structured agent commerce configuration JSON:
            - business_type: string
            - readiness_score: int (between 90 and 99)
            - catalog_status: "connected"
            - products_indexed: int
            - inventory_synced: bool
            - pricing_guardrail: {{"base_price_modifiable": false, "max_promotional_discount_pct": int, "max_cart_modification_inr": int}}
            - recommendations_enabled: bool
            - cross_sell_enabled: bool
            - payment_provider: "razorpay"
            - customer_approval_required: true
            - ai_readiness_summary: string
            """
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are Berry AI Merchant Configuration Engine. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            raw = json.loads(response.choices[0].message.content)
            return MerchantConfigResponse(**raw)
        except Exception as e:
            logger.warning(f"OpenAI error in merchant prompt, using fallback: {e}")

    return MerchantConfigResponse(
        business_type="Athletic Footwear & Apparel",
        readiness_score=98,
        catalog_status="connected",
        products_indexed=248,
        inventory_synced=True,
        pricing_guardrail={
            "base_price_modifiable": False,
            "max_promotional_discount_pct": 20,
            "max_cart_modification_inr": 1000,
        },
        recommendations_enabled=True,
        cross_sell_enabled=True,
        payment_provider="razorpay",
        customer_approval_required=True,
        ai_readiness_summary="Catalog indexed, real-time inventory synced, pricing guardrails locked, and Razorpay checkout engine activated.",
    )

@app.get("/merchant/growth-opportunities", response_model=List[OpportunityItem])
def get_growth_opportunities():
    return [
        OpportunityItem(
            id="opp-01",
            title="Running Shoes → Performance Socks Cross-Sell",
            type="upsell",
            acceptance_rate="31%",
            estimated_revenue_inr=12400.0,
            description="Agent automatically suggests ₹499 anti-blister socks when shoe purchase is within buyer spending limit.",
            action_label="Enable Agent Cross-Sell",
        ),
        OpportunityItem(
            id="opp-02",
            title="Cart Abandonment Recovery > ₹5,000",
            type="recovery",
            acceptance_rate="42%",
            estimated_revenue_inr=8700.0,
            description="Offer automated free express shipping waiver when cart value exceeds ₹5,000.",
            action_label="Review Policy Rule",
        ),
        OpportunityItem(
            id="opp-03",
            title="Sneaker Maintenance & Cleaning Bundle",
            type="campaign",
            acceptance_rate="24%",
            estimated_revenue_inr=5200.0,
            description="Target runners post-purchase with footwear waterproofing and odor kit add-on.",
            action_label="Create AI Campaign",
        ),
    ]

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    logger.info(f"🐍 Starting Berry Python Agent on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
