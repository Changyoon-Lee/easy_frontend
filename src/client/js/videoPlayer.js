const articleInfo = document.getElementById("articleInfo");
console.log(articleInfo.dataset.id)
fetch(`/api/article/${articleInfo.dataset.id}/view`)