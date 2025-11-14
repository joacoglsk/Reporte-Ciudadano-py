import os
from google import genai

def query_ai(prompt: str):
    try:
        # Inicializar cliente con clave desde variables de entorno
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        print("📩 Mensaje enviado a la IA:", prompt)

        # Enviar prompt al modelo Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # Extraer texto de la respuesta
        return response.text

    except Exception as e:
        print("💥 ERROR EN IA:", e)
        return "Error generando respuesta."
