fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    const searchCharacterInput = document.getElementById("searchCharacter");
    const characterResultsDiv = document.getElementById("characterResults");
    const searchRecipeInput = document.getElementById("searchRecipe");
    const recipeResultsDiv = document.getElementById("recipeResults");

    // 搜索角色和物品
    searchCharacterInput.addEventListener("input", () => {
      const query = searchCharacterInput.value.trim();
      characterResultsDiv.innerHTML = "";

      if (query) {
        data.characters.forEach(character => {
          if (character.character.includes(query)) {
            // 显示角色和物品信息
            const characterDiv = document.createElement("div");
            characterDiv.className = "character";
            characterDiv.textContent = `角色: ${character.character} (${character.date})`;
            characterResultsDiv.appendChild(characterDiv);

            // 显示物品列表
            Object.entries(character.preferences).forEach(([key, items]) => {
              items.forEach(item => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "item";
                itemDiv.textContent = `${key === "favorite" ? "喜爱" : key === "like" ? "喜欢" : "中立"}: ${item.item} (+${item.points})`;
                characterResultsDiv.appendChild(itemDiv);
              });
            });
          }
        });
      }
    });

    // 搜索食谱
    searchRecipeInput.addEventListener("input", () => {
      const query = searchRecipeInput.value.trim();
      recipeResultsDiv.innerHTML = "";

      if (query) {
        data.recipes.forEach(recipe => {
          if (recipe.name.includes(query)) {
            const recipeDiv = document.createElement("div");
            recipeDiv.className = "recipe";
            recipeDiv.textContent = `食谱: ${recipe.name}`;

            // 展示材料
            const ingredientsDiv = document.createElement("div");
            ingredientsDiv.className = "ingredients";
            ingredientsDiv.textContent = `材料: ${recipe.ingredients.join(", ")}`;
            recipeDiv.appendChild(ingredientsDiv);

            // 展示属性（数字用绿色显示）
            const attributesDiv = document.createElement("div");
            attributesDiv.className = "attributes";
            attributesDiv.innerHTML = `属性: ${recipe.attributes
              .map(attr => attr.replace(/(\+\d+%?)/g, '<span style="color:green;">$1</span>'))
              .join(", ")}`;
            recipeDiv.appendChild(attributesDiv);

            recipeResultsDiv.appendChild(recipeDiv);
          }
        });
      }
    });
  })
  .catch(error => {
    console.error('数据加载失败:', error);
  });
