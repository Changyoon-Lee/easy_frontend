const articleInfo = document.getElementById("articleInfo");
console.log(articleInfo.dataset.id)
fetch(`/api/article/${articleInfo.dataset.id}/view`)

const deleteBtn = document.getElementById("deleteBtn")
deleteBtn.addEventListener("click", async () => {
    const { status } = await fetch("/article/delete",
        {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ articleId: articleInfo.dataset.id })
        });

    if (status === 200) {
        history.back();
    }

})