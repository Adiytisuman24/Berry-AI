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

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

openai_client = None
AI_MODEL = "deepseek-v4-flash"
AI_PROVIDER = "none"

# Try DeepSeek first (faster, no quota issues for this key)
if DEEPSEEK_API_KEY:
    try:
        from openai import OpenAI as _OpenAI
        _client = _OpenAI(
            api_key=DEEPSEEK_API_KEY,
            base_url="https://api.deepseek.com",
            max_retries=0,
            timeout=8.0,
        )
        # Quick validation
        _client.models.list()
        openai_client = _client
        AI_MODEL = "deepseek-v4-flash"
        AI_PROVIDER = "deepseek"
        logger.info(f"🚀 DeepSeek AI client initialized! model={AI_MODEL}")
    except Exception as e:
        err_str = str(e)
        if "429" in err_str or "quota" in err_str or "credit" in err_str:
            logger.warning(f"⚠️  DeepSeek quota issue: {e}")
        else:
            logger.warning(f"DeepSeek init failed, trying OpenAI: {e}")

# Fallback to OpenAI if DeepSeek not available
if openai_client is None and OPENAI_API_KEY and not OPENAI_API_KEY.startswith("sk-demo"):
    try:
        from openai import OpenAI as _OpenAI
        _client = _OpenAI(api_key=OPENAI_API_KEY, max_retries=0, timeout=8.0)
        _client.models.list()
        openai_client = _client
        AI_MODEL = "gpt-4o-mini"
        AI_PROVIDER = "openai"
        logger.info(f"⚡ OpenAI fallback client initialized! model={AI_MODEL}")
    except Exception as e:
        logger.warning(f"OpenAI also unavailable: {e}")

if openai_client is None:
    logger.warning("⚠️  No AI provider available — running in deterministic fallback mode")


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
def health_check():
    return {
        "status": "healthy",
        "service": "berry-python-agent",
        "ai_configured": bool(openai_client is not None),
        "ai_provider": AI_PROVIDER,
        "model": AI_MODEL,
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
                model=AI_MODEL,
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
                model=AI_MODEL,
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
        raise HTTPException(status_code=400, detail="No products provided for evaluation")

    # Filter by budget
    affordable = [p for p in candidates if p.price <= req.budget_limit]
    if not affordable:
        affordable = candidates # fallback if none fit budget

    top_picks = affordable[:3]
    best_product = top_picks[0]

    if openai_client:
        try:
            prod_json = json.dumps([p.dict() for p in affordable])
            prompt = f"""
            Evaluate these products for query: "{req.query}" with budget ₹{req.budget_limit}.
            Products: {prod_json}
            Pick the best product and explain why.
            Output JSON:
            - recommended_product_id: string
            - recommendation_summary: string
            - reasoning_points: list of 3-4 strings
            """
            response = openai_client.chat.completions.create(
                model=AI_MODEL,
                messages=[
                    {"role": "system", "content": "You are Berry AI ranking engine. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            raw = json.loads(response.choices[0].message.content)
            rec_id = raw.get("recommended_product_id", best_product.id)
            # Ensure rec_id is in top_picks
            found = next((p for p in affordable if p.id == rec_id), None)
            if found:
                best_product = found
                # move to front
                top_picks = [best_product] + [p for p in top_picks if p.id != rec_id][:2]
            
            return EvaluationResponse(
                total_evaluated=len(candidates),
                top_picks=top_picks,
                recommended_product_id=best_product.id,
                recommendation_summary=raw.get("recommendation_summary", f"{best_product.name} is the strongest match."),
                reasoning_points=raw.get("reasoning_points", ["Matches criteria.", f"Fits budget ₹{req.budget_limit}."])
            )
        except Exception as e:
            logger.warning(f"OpenAI evaluate error: {e}")

    # Fallback response
    return EvaluationResponse(
        total_evaluated=len(candidates),
        top_picks=top_picks,
        recommended_product_id=best_product.id,
        recommendation_summary=f"{best_product.name} is the strongest match because it fits your use case and stays within your ₹{req.budget_limit:,.0f} boundary.",
        reasoning_points=[
            f"Strong match for category {best_product.category}.",
            f"Stays within authorized boundary (₹{best_product.price:,.0f} vs ₹{req.budget_limit:,.0f}).",
            "Verified merchant inventory.",
        ],
    )

@app.post("/agent/cross-sell", response_model=CrossSellItem)
def get_cross_sell(req: CrossSellRequest):
    logger.info(f"Cross-sell requested for {req.primary_product_name}")
    # We will pass the cross-sell logic primarily back to Go, but if called, just return a generic matching accessory.
    # In a real implementation this would evaluate the DB items passed in.
    item_price = 499.0
    fits = (req.current_cart_total + item_price) <= req.purchase_limit

    return CrossSellItem(
        id="cross-socks-01",
        name="Performance Anti-Blister Socks",
        price=item_price,
        category="accessories",
        attach_rate_pct=31,
        pitch=f"Frequently purchased with {req.primary_product_name} to enhance your experience.",
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
                model=AI_MODEL,
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
