
import React from "react";

export default function Favorites({ favorites, onToggleFavorite, onDeleteRecipe }) {
  const getTotalPrice = (products) =>
    products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0).toFixed(2);

  const getTotalCount = (products) =>
    products
      .filter(p => p.unit === "бр.")
      .reduce((sum, p) => sum + (parseFloat(p.qty) || 0), 0);

  return (
    <>
      <h2>Любими рецепти</h2>
      {favorites.map(recipe => (
        <div className="recipe" key={recipe.id}>
          <h3>{recipe.title} ({recipe.category})</h3>
          <ul>
            {recipe.products.map((p, i) => (
              <li key={i}>
                {p.qty} {p.unit} {p.name} - {p.price} лв.
              </li>
            ))}
          </ul>
          {getTotalCount(recipe.products) > 0 && (
            <p>Общо: {getTotalCount(recipe.products)} бр.</p>
          )}
          <p>Обща цена: {getTotalPrice(recipe.products)} лв.</p>
          <button onClick={() => onToggleFavorite(recipe.id)}>
            Премахни или редактирай от любими
          </button>
          <button onClick={() => onDeleteRecipe(recipe.id)} style={{ background: "crimson" }}>
            Изтрий рецепта
          </button>
        </div>
      ))}
    </>
  );
}
