// 假设你有角色和食谱的数据文件
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
          const matchedItems = [];

          // 搜索角色名
          if (character.character.includes(query)) {
            matchedItems.push(...Object.entries(character.preferences).flatMap(([key, items]) =>
              items.map(item => ({ ...item, type: key }))
            ));

            // 显示角色
            const characterDiv = document.createElement("div");
            characterDiv.className = "character";
            characterDiv.textContent = `${character.character} (${character.date})`;
            characterDiv.addEventListener("click", () => toggleItems(character));
            characterResultsDiv.appendChild(characterDiv);
          }

          // 搜索物品名
          Object.entries(character.preferences).forEach(([key, items]) => {
            items.forEach(item => {
              if (item.item.includes(query)) {
                matchedItems.push({ ...item, type: key });
              }
            });
          });

          // 显示匹配物品
          if (matchedItems.length > 0) {
            const characterDiv = document.createElement("div");
            characterDiv.className = "character";
            characterDiv.textContent = `角色: ${character.character} (${character.date})`;
            characterResultsDiv.appendChild(characterDiv);

            matchedItems.forEach(match => {
              const itemDiv = document.createElement("div");
              itemDiv.className = "item";
              itemDiv.textContent = `${match.type === "favorite" ? "喜爱" : match.type === "like" ? "喜欢" : "中立"}: ${match.item} (+${match.points})`;
              characterResultsDiv.appendChild(itemDiv);
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

    // 展示/隐藏角色物品
    function toggleItems(character) {
      const itemsDiv = document.getElementById(`items-${character.character}`);
      if (itemsDiv) {
        itemsDiv.classList.toggle("hidden");
      } else {
        const newItemsDiv = document.createElement("div");
        newItemsDiv.id = `items-${character.character}`;
        character.preferences.favorite.forEach(item => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "item";
          itemDiv.textContent = `喜爱: ${item.item} (+${item.points})`;
          newItemsDiv.appendChild(itemDiv);
        });
        character.preferences.like.forEach(item => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "item";
          itemDiv.textContent = `喜欢: ${item.item} (+${item.points})`;
          newItemsDiv.appendChild(itemDiv);
        });
        character.preferences.neutral.forEach(item => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "item";
          itemDiv.textContent = `中立: ${item.item} (+${item.points})`;
          newItemsDiv.appendChild(itemDiv);
        });
        characterResultsDiv.appendChild(newItemsDiv);
      }
    }
  });
