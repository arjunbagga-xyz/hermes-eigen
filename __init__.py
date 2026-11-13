"""eigen: Spectral Graph Laplacian & Fiedler Vector Partitioner for Code, Prompts & Datasets."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Optional, Union

from .engine import (
    EIGEN_AST_SCHEMA,
    EIGEN_PARTITION_SCHEMA,
    EIGEN_PROMPT_DATA_SCHEMA,
    LAST_EIGEN_CACHE,
    VelvetEigenDelegationProvider,
    _ensure_json_str,
    handle_eigen_ast_spectrum,
    handle_eigen_partition,
    handle_eigen_prompt_and_data_partition,
)


def pre_llm_call_hook(
    session_id: Union[str, Dict[str, Any]] = "",
    user_message: str = "",
    **kwargs: Any,
) -> Optional[Dict[str, Any]]:
    payload_dict = session_id if isinstance(session_id, dict) else None
    user_text = (
        str(payload_dict.get("user_message", "") or payload_dict.get("prompt", ""))
        if payload_dict is not None
        else str(user_message or kwargs.get("prompt", ""))
    )
    lower = user_text.lower()
    import re
    # Extract candidate subtasks/clauses from the actual user prompt
    clauses = [c.strip().lstrip("0123456789.-*•) ") for c in re.split(r"[\n;]+", user_text) if c.strip()]
    meaningful = [c for c in clauses if len(c.split()) >= 3]
    if len(meaningful) >= 2 and any(k in lower for k in ("parallel", "dataset", ".csv", "refactor", "patch", "modules", "subagent")):
        spec = handle_eigen_prompt_and_data_partition({"prompt_subtasks": meaningful})
        if isinstance(spec, dict) and spec.get("status") == "ok":
            ribbon = (
                f"[EIGEN_LAPLACIAN_PARTITION | lambda_2={spec['lambda_2_algebraic_connectivity']} | "
                f"Cheeger_phi={spec['cheeger_conductance_phi']} | Cluster_A={len(spec['cluster_a'])} tasks, Cluster_B={len(spec['cluster_b'])} tasks]"
            )
            if payload_dict is not None:
                existing = str(payload_dict.get("injected_context", ""))
                payload_dict["injected_context"] = (existing + chr(10) + ribbon).strip()
                payload_dict["context"] = ribbon
                payload_dict["eigen_prepartition"] = spec
                return payload_dict
            return {"context": ribbon, "eigen_prepartition": spec}

    return payload_dict if payload_dict is not None else None


def post_llm_call_hook(
    session_id: Union[str, Dict[str, Any]] = "",
    **kwargs: Any,
) -> Optional[Dict[str, Any]]:
    if isinstance(session_id, dict):
        latest = LAST_EIGEN_CACHE.get("latest")
        if latest and "transcript_directive" in latest:
            session_id.setdefault("directives", []).append(latest["transcript_directive"])
        return session_id
    return None


def _tool_handler(fn):
    """Wrap a dict-returning engine handler so Hermes tool_call gets a JSON string."""
    def wrapper(args=None, **kwargs):
        result = fn(args if args is not None else {}, **kwargs)
        return _ensure_json_str(result)
    return wrapper


def register(ctx) -> None:
    ctx.register_tool(
        name="eigen_partition",
        toolset="eigen",
        schema=EIGEN_PARTITION_SCHEMA,
        handler=_tool_handler(handle_eigen_partition),
        is_async=False,
        emoji="💎",
    )
    ctx.register_tool(
        name="eigen_ast_spectrum",
        toolset="eigen",
        schema=EIGEN_AST_SCHEMA,
        handler=_tool_handler(handle_eigen_ast_spectrum),
        is_async=False,
        emoji="🕸️",
    )
    ctx.register_tool(
        name="eigen_prompt_and_data_partition",
        toolset="eigen",
        schema=EIGEN_PROMPT_DATA_SCHEMA,
        handler=_tool_handler(handle_eigen_prompt_and_data_partition),
        is_async=False,
        emoji="🧩",
    )

    ctx.register_hook("pre_llm_call", pre_llm_call_hook)
    ctx.register_hook("post_llm_call", post_llm_call_hook)
    ctx.register_delegation_provider(VelvetEigenDelegationProvider())

    skills_dir = Path(__file__).parent / "skills"
    if hasattr(ctx, "register_skill") and skills_dir.exists():
        for child in sorted(skills_dir.iterdir()):
            skill_md = child / "SKILL.md"
            if child.is_dir() and skill_md.exists():
                ctx.register_skill(child.name, skill_md)
