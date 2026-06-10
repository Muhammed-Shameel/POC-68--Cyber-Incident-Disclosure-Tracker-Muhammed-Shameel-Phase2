import os
import sys
from dotenv import load_dotenv
from .base import AIProvider
from .local import LocalFallbackProvider

load_dotenv()

def get_provider() -> AIProvider:
    openai_key = os.getenv("OPENAI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    preferred_provider = os.getenv("AI_PROVIDER", "openai").lower()

    # Try Anthropic if preferred and key exists
    if preferred_provider == "anthropic":
        if anthropic_key:
            try:
                # Lazy import: only try to import if Anthropic is preferred and key is present
                from .anthropic import AnthropicProvider
                print("Using AnthropicProvider.")
                return AnthropicProvider(api_key=anthropic_key)
            except ImportError:
                print("Warning: Anthropic package not found. Falling back to LocalFallbackProvider.", file=sys.stderr)
            except Exception as e:
                print(f"Warning: Failed to initialize AnthropicProvider: {e}. Falling back to LocalFallbackProvider.", file=sys.stderr)
        else:
            print("Warning: ANTHROPIC_API_KEY not set. Falling back to LocalFallbackProvider.", file=sys.stderr)
    
    # Try OpenAI if preferred (or no specific preference and key exists)
    if preferred_provider == "openai" or (not preferred_provider and openai_key):
        if openai_key:
            try:
                # Lazy import: only try to import if OpenAI is preferred and key is present
                from .openai import OpenAIProvider
                print("Using OpenAIProvider.")
                return OpenAIProvider(api_key=openai_key)
            except ImportError:
                print("Warning: OpenAI package not found. Falling back to LocalFallbackProvider.", file=sys.stderr)
            except Exception as e:
                print(f"Warning: Failed to initialize OpenAIProvider: {e}. Falling back to LocalFallbackProvider.", file=sys.stderr)
        else:
            print("Warning: OPENAI_API_KEY not set. Falling back to LocalFallbackProvider.", file=sys.stderr)
    
    # If no preferred provider could be loaded or no keys at all
    print("No AI provider configured or available. Using LocalFallbackProvider.", file=sys.stderr)
    return LocalFallbackProvider()
