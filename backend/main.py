from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
import joblib

app = FastAPI(title="API de Predicción de Vehículos", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    modelo = joblib.load("../model/modelo_gb_autos.pkl")
    columnas_entrenamiento = joblib.load("../model/columnas_autos.pkl")
    print(" Modelo y columnas cargados correctamente.")
except Exception as e:
    print(f" Error al cargar los archivos .pkl: {e}")

#Esquema de datos para definir datos obligatorios que debe enviar el front
class AutoInput(BaseModel):
    year: int = Field(..., description="Año de fabricación")
    km_driven: float = Field(..., description="Kilómetros recorridos")
    mileage: float = Field(..., description="Consumo (kmpl)")
    engine: float = Field(..., gt=0, description="Cilindrada en CC")
    max_power: float = Field(..., description="Caballos de fuerza (bhp)")
    brand: str = Field(..., description="Marca del vehículo")
    fuel: str = Field(..., description="Tipo de combustible")
    seller_type: str = Field(..., description="Tipo de vendedor")
    transmission: str = Field(..., description="Transmisión (Manual/Automatic)")
    owner: str = Field(..., description="Historial de dueños")

@app.post("/predict")
def predecir_precio(auto: AutoInput):
    try:
        df_input = pd.DataFrame([auto.model_dump()])
        
        df_input['km_per_year'] = df_input['km_driven'] / ((2024 - df_input['year']) + 1)
        df_input['specific_power'] = df_input['max_power'] / (df_input['engine'] / 1000)
        
        df_dummies = pd.get_dummies(df_input)
        
        df_final = df_dummies.reindex(columns=columnas_entrenamiento, fill_value=0)
        
        prediccion_log = modelo.predict(df_final)[0]
        
        #Se pasa de logaritmo a dinero real con expm1
        precio_real = np.expm1(prediccion_log)
        
        return {
            "status": "success",
            "predicted_price": round(precio_real, 2),
            "currency": "INR"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el procesamiento: {str(e)}")

#Corre en http://localhost:8000
@app.get("/")
def home():
    return {"mensaje": "API de Predicción de vehículos"}