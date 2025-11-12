import os
from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from urllib.request import urlopen
import json

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
API_AUDIENCE = os.getenv("AUTH0_AUDIENCE")
ALGORITHMS = ["RS256"]

reusable_oauth2 = HTTPBearer()

def verify_jwt(token: str = Depends(reusable_oauth2)):
    try:
        # Obtener JWKS de Auth0
        jsonurl = urlopen(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())

        unverified_header = jwt.get_unverified_header(token.credentials)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }

        if not rsa_key:
            raise HTTPException(status_code=401, detail="Clave pública no encontrada")

        payload = jwt.decode(
            token.credentials,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=API_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )

        return payload

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")

