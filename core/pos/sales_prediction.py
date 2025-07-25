import os

import pandas as pd
import numpy as np
import xgboost as xgb
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error

print("Cargando los datos...")
try:
    script_dir = os.path.dirname(__file__)
    csv_path = os.path.join(script_dir, 'historico_ventas.csv')
    df = pd.read_csv(csv_path)
except FileNotFoundError:
    print("Error: Asegúrate de que el archivo 'historico_ventas.csv' esté en la misma carpeta que este script.")
    exit()

df['fecha_venta'] = pd.to_datetime(df['fecha_venta'])

df_diario = df.groupby('fecha_venta')['cantidad_vendida'].sum().reset_index()
df_diario = df_diario.set_index('fecha_venta')

df_diario = df_diario.asfreq('D', fill_value=0)

print("Datos diarios preparados:")
print(df_diario.head())

df_diario['dia_del_año'] = df_diario.index.dayofyear
df_diario['dia_del_mes'] = df_diario.index.day
df_diario['dia_de_la_semana'] = df_diario.index.dayofweek # Lunes=0, Domingo=6
df_diario['mes'] = df_diario.index.month
df_diario['año'] = df_diario.index.year
df_diario['semana_del_año'] = df_diario.index.isocalendar().week.astype(int)

print("\nDatos con características de fecha:")
print(df_diario.head())

X = df_diario.drop('cantidad_vendida', axis=1)
y = df_diario['cantidad_vendida']

split_date = df_diario.index.max() - pd.DateOffset(days=int(len(df_diario) * 0.2))
X_train, X_test = X.loc[X.index <= split_date], X.loc[X.index > split_date]
y_train, y_test = y.loc[y.index <= split_date], y.loc[y.index > split_date]

print(f"\nEntrenando y evaluando con datos hasta {split_date.date()}...")

model_test = xgb.XGBRegressor(
    objective='reg:squarederror',
    n_estimators=1000,
    learning_rate=0.01,
    max_depth=5,
    early_stopping_rounds=50
)

model_test.fit(X_train, y_train,
             eval_set=[(X_test, y_test)],
             verbose=False)

print("Modelo de prueba entrenado exitosamente.")

predictions = model_test.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))

print(f"\nEvaluación del modelo en los datos de prueba:")
print(f"Error Absoluto Medio (MAE): {mae:.2f} unidades")
print(f"Raíz del Error Cuadrático Medio (RMSE): {rmse:.2f} unidades")
print(f"-> En promedio, el modelo se equivoca en ±{mae:.2f} unidades al predecir las ventas diarias.")

plt.figure(figsize=(15, 6))
plt.title('Comparación: Ventas Reales vs. Predicciones (Datos de Prueba)', fontsize=16)
plt.plot(y_test.index, y_test, label='Ventas Reales', color='blue')
plt.plot(y_test.index, predictions, label='Predicciones del Modelo', color='red', linestyle='--')
plt.xlabel('Fecha')
plt.ylabel('Cantidad Vendida')
plt.legend()
plt.grid(True, linestyle='--', alpha=0.6)
plt.savefig('grafica_prueba.png')
print("\nGráfica de prueba guardada como 'grafica_prueba.png'")


print("\nRealizando predicción para los próximos 30 días...")

final_model = xgb.XGBRegressor(
    objective='reg:squarederror',
    n_estimators=1000,
    learning_rate=0.01,
    max_depth=5
)
final_model.fit(X, y, verbose=False)

future_dates = pd.date_range(start=df_diario.index.max() + pd.Timedelta(days=1), periods=30, freq='D')
future_df = pd.DataFrame(index=future_dates)

future_df['dia_del_año'] = future_df.index.dayofyear
future_df['dia_del_mes'] = future_df.index.day
future_df['dia_de_la_semana'] = future_df.index.dayofweek
future_df['mes'] = future_df.index.month
future_df['año'] = future_df.index.year
future_df['semana_del_año'] = future_df.index.isocalendar().week.astype(int)

future_predictions = final_model.predict(future_df)


plt.figure(figsize=(15, 6))
plt.title('Predicción de Ventas para los Próximos 30 Días', fontsize=16)
plt.plot(df_diario.index, df_diario['cantidad_vendida'], label='Ventas Históricas', color='blue')
plt.plot(future_dates, future_predictions, label='Predicción Futura', color='green', linestyle='--')
plt.xlabel('Fecha')
plt.ylabel('Cantidad Vendida')
plt.legend()
plt.grid(True, linestyle='--', alpha=0.6)
plt.savefig('grafica_prediccion_futura.png')
print("Gráfica de predicción futura guardada como 'grafica_prediccion_futura.png'")
