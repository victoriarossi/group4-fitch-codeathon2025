import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_csv("data/environmental_activities.csv")

for activity_type, group in df.groupby("activity_type"):
    x = np.arange(len(group))
    y = group["env_score_adjustment"].values

    fig, axes = plt.subplots(1, 3, figsize=(15, 4))

    axes[0].scatter(x, y)
    axes[0].set_xticks(x)
    axes[0].set_xticklabels(group["activity_code"], rotation=60, ha="right")
    axes[0].set_ylabel("env_score_adjustment")
    axes[0].set_title("Scatter")

    axes[1].hist(y, bins=10, density=True)
    axes[1].set_title("Density")

    h = axes[2].hist2d(x, y, bins=(len(group), 10))
    fig.colorbar(h[3], ax=axes[2])
    axes[2].set_xticks(x)
    axes[2].set_xticklabels(group["activity_code"], rotation=60, ha="right")
    axes[2].set_title("Heatmap")

    fig.suptitle(activity_type)
    fig.tight_layout()
    fig.savefig(f"./environmental_graphs/{activity_type}_env_scores_multi.png")
    plt.close(fig)