import numpy as np
import plotly.graph_objects as go

# ----------------------------
# Parâmetros fixos
# ----------------------------

v0 = 20        # velocidade inicial (m/s)
g = 9.8        # gravidade (m/s²)

theta_min = 10
theta_max = 80
theta_step = 1

# ----------------------------
# Limites fixos do gráfico
# ----------------------------

R_max = v0**2 / g
H_max = v0**2 / (2*g)

# ----------------------------
# Função de simulação
# ----------------------------

def simulate(theta_deg):
    theta = np.deg2rad(theta_deg)
    t_f = 2 * v0 * np.sin(theta) / g
    t = np.linspace(0, t_f, 200)

    x = v0 * np.cos(theta) * t
    y = v0 * np.sin(theta) * t - 0.5 * g * t**2

    return x, y


# ----------------------------
# Criar figura base
# ----------------------------

fig = go.Figure()

# Traço inicial
x0, y0 = simulate(theta_min)

fig.add_trace(go.Scatter(
    x=x0,
    y=y0,
    mode="lines",
    line=dict(width=3),
    name="Trajetória"
))

fig.update_layout(
    title=f"Lançamento Oblíquo (θ = {theta_min}°)",
    xaxis=dict(range=[0, R_max], title="x (m)"),
    yaxis=dict(range=[0, H_max], title="y (m)"),
    template="plotly_white",
    updatemenus=[
        dict(
            type="buttons",
            buttons=[
                dict(label="▶ Play",
                     method="animate",
                     args=[None,
                           {"frame": {"duration": 50, "redraw": True},
                            "fromcurrent": True}]),
                dict(label="⏸ Pause",
                     method="animate",
                     args=[[None],
                           {"frame": {"duration": 0},
                            "mode": "immediate"}])
            ]
        )
    ]
)

# ----------------------------
# Criar frames de animação
# ----------------------------

frames = []

for theta in np.arange(theta_min, theta_max + theta_step, theta_step):
    x, y = simulate(theta)

    frames.append(go.Frame(
        data=[go.Scatter(x=x, y=y)],
        name=str(theta),
        layout=go.Layout(
            title=f"Lançamento Oblíquo (θ = {theta:.0f}°)"
        )
    ))

fig.frames = frames

# ----------------------------
# Slider
# ----------------------------

sliders = [dict(
    steps=[
        dict(method="animate",
             args=[[str(theta)],
                   {"mode": "immediate",
                    "frame": {"duration": 50, "redraw": True},
                    "transition": {"duration": 0}}],
             label=str(theta))
        for theta in np.arange(theta_min, theta_max + theta_step, theta_step)
    ],
    transition={"duration": 0},
    x=0.1,
    len=0.8,
    currentvalue={"prefix": "Ângulo (graus): "}
)]

fig.update_layout(sliders=sliders)

# ----------------------------
# Salvar como HTML
# ----------------------------

fig.write_html(
    "oblique-launch.html",
    include_plotlyjs="cdn",
    full_html=True
)
