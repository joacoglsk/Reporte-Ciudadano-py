import openai, os
openai.api_key = os.getenv("OPENAI_API_KEY")

def query_ai(prompt: str):
  try:
    resp = openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=[{"role":"user","content":prompt}],
      max_tokens=120,
    )
    return resp.choices[0].message.content.strip()
  except:
    return "Error generando respuesta."
