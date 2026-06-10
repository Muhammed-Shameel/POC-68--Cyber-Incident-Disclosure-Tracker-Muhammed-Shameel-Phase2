# System Prompts
SYSTEM_PROMPT = """You are a senior cyber intelligence analyst. 
Your task is to generate executive-level intelligence summaries from provided incident data.
Your tone should be professional, objective, and concise. 
Focus on actionable insights and high-level trends that a C-suite executive would care about."""

# Executive Summary Prompt
EXECUTIVE_SUMMARY_PROMPT = """
Please generate a comprehensive executive cyber intelligence summary based on the following data:

DATASET OVERVIEW:
{summary_stats}

KEY INSIGHTS:
{rule_based_insights}

TRENDS:
{trend_data}

Provide the summary in the following format:
1. Executive Overview (What is happening?)
2. Key Findings (Why does it matter?)
3. Emerging Threats (What are the new risks?)
4. Strategic Focus Areas (What should leadership pay attention to?)
"""

# Sector Intelligence Brief Prompt
SECTOR_BRIEF_PROMPT = """
Please generate a sector-specific intelligence brief based on the following data:

SECTOR DATA:
{sector_data}

Focus on:
- Which sectors are most targeted.
- Which sectors are seeing the fastest growth in incidents.
- Risk concentration across industries.
"""

# Attack Trend Brief Prompt
ATTACK_TREND_PROMPT = """
Please generate an attack trend intelligence brief based on the following data:

ATTACK DATA:
{attack_data}

Focus on:
- Dominant attack vectors.
- Significant shifts in attack methodologies.
- Growth or decline of specific threats like Ransomware or Supply Chain attacks.
"""

# Risk Intelligence Brief Prompt
RISK_BRIEF_PROMPT = """
Please generate a risk intelligence brief based on the following high-risk incident data:

HIGH RISK INCIDENTS:
{high_risk_data}

Focus on:
- Common patterns among high-risk incidents.
- Severity concentration.
- Immediate observations from critical-level disclosures.
"""
