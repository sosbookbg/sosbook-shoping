
import React, { useState, useEffect } from "react";
import Favorites from "./Favorites";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Дресинг за салата");

  const categoryList = [
    "Дресинг за салата",
    "Сосове за картофи",
    "Сосове за риба",
    "Сосове за пиле",
    "Сосове за свинско",
    "Сососве за вегетариански ястия",
    "Веган сосове",
    "Сосове за паста",
    "Сосове за барбекю",
    "Сосове за бургери и дюнери",
    "Сосове и кремове за десерти"
  ];

  // Зареждане от localStorage при стартиране
  useEffect(() => {
    const stored = localStorage.getItem("sosbook-recipes");
    if (stored) {
      setRecipes(JSON.parse(stored));
    }
  }, []);

  // Запазване в localStorage при промяна
  useEffect(() => {
    localStorage.setItem("sosbook-recipes", JSON.stringify(recipes));
  }, [recipes]);

  const handleAddRecipe = () => {
    if (!title.trim()) return;
    setRecipes([
      ...recipes,
      {
        id: Date.now(),
        title,
        category,
        products: [],
        isFavorite: false,
        newProduct: "",
        newQty: "",
        newUnit: "г",
        newPrice: ""
      }
    ]);
    setTitle("");
  };

  const updateRecipeField = (id, field, value) => {
    setRecipes(recipes.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addProductToRecipe = (id) => {
    setRecipes(recipes.map(r => {
      if (r.id === id) {
        const newProd = {
          id: Date.now(),
          name: r.newProduct,
          qty: r.newQty,
          unit: r.newUnit,
          price: r.newPrice,
          bought: false
        };
        return {
          ...r,
          products: [...r.products, newProd],
          newProduct: "",
          newQty: "",
          newUnit: "г",
          newPrice: ""
        };
      }
      return r;
    }));
  };

  const toggleBought = (rid, pid) => {
    setRecipes(recipes.map(r => {
      if (r.id === rid) {
        return {
          ...r,
          products: r.products.map(p =>
            p.id === pid ? { ...p, bought: !p.bought } : p
          )
        };
      }
      return r;
    }));
  };

  const deleteProduct = (rid, pid) => {
    setRecipes(recipes.map(r => {
      if (r.id === rid) {
        return {
          ...r,
          products: r.products.filter(p => p.id !== pid)
        };
      }
      return r;
    }));
  };

  const toggleFavorite = (id) => {
    setRecipes(recipes.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const getTotalPrice = (products) =>
    products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0).toFixed(2);

  const favorites = recipes.filter(r => r.isFavorite);
  const others = recipes.filter(r => !r.isFavorite);

  return (
    <div className="App">
      <h1>Пазарувай лесно със СосБук</h1>
      <div className="form-wrapper">
        <input placeholder="Заглавие на рецепта" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categoryList.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={handleAddRecipe} className="add-button">Добави</button>
      </div>

      {others.map(recipe => (
        <div className="recipe" key={recipe.id}>
          <h2>{recipe.title} ({recipe.category})</h2>
          <div className="form small">
            <input value={recipe.newProduct} placeholder="Продукт" onChange={e => updateRecipeField(recipe.id, "newProduct", e.target.value)} />
            <input value={recipe.newQty} type="number" placeholder="Кол." onChange={e => updateRecipeField(recipe.id, "newQty", e.target.value)} />
            <select value={recipe.newUnit} onChange={e => updateRecipeField(recipe.id, "newUnit", e.target.value)}>
              <option>г</option><option>мл</option><option>бр.</option>
            </select>
            <input value={recipe.newPrice} type="number" placeholder="Цена" onChange={e => updateRecipeField(recipe.id, "newPrice", e.target.value)} />
            <button onClick={() => addProductToRecipe(recipe.id)}>Добави</button>
          </div>
          <ul>
            {recipe.products.map(p => (
              <li key={p.id} className={p.bought ? "bought" : ""}>
                {p.qty} {p.unit} {p.name} - {p.price} лв.
                <button onClick={() => toggleBought(recipe.id, p.id)}>Купено</button>
                <button onClick={() => deleteProduct(recipe.id, p.id)}>Изтрий</button>
              </li>
            ))}
          </ul>
          <p>Обща цена: {getTotalPrice(recipe.products)} лв.</p>
          <button onClick={() => toggleFavorite(recipe.id)}>Добави в любими</button>
          <button onClick={() => deleteRecipe(recipe.id)} style={{ background: "crimson" }}>Изтрий рецепта</button>
        </div>
      ))}

      {favorites.length > 0 && (
        <Favorites
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onDeleteRecipe={deleteRecipe}
        />
      )}
    </div>
  );
}

export default App;
