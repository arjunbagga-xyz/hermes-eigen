---
name: eigen-workflow
description: Partition codebases, complex prompts, and datasets into zero-conflict parallel subagent clusters using the Normalized Graph Laplacian and Fiedler Vector v_2.
---
# Velvet Eigen Spectral Partitioning Workflow
Before spawning parallel subagents or refactoring multi-module repositories:
1. Call `eigen_ast_spectrum`, `eigen_partition`, or `eigen_prompt_and_data_partition` to compute Algebraic Connectivity `lambda_2`, Fiedler vector `v_2`, and architectural chokepoint stress.
2. Freeze all cross-cut interface contracts and emit `::eigen{lambda_2="..." phi="..." contracts="..."}` in the transcript.
