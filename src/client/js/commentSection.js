const commentForm = document.getElementById("comment-form");
const articleInfo = document.getElementById("articleInfo");

const articleId = articleInfo.dataset.id;

const handleSubmit = async (event) => {
    event.preventDefault();
    const textArea = commentForm.querySelector("textarea");
    const text = textArea.value;
    if (text === "") {
        return;
    }
    const { status } = await fetch(`/api/article/${articleId}/comment`,
        {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

    console.log(res.status);
    if (status === 200) {
        window.location.reload();
    }
    textArea.value = "";
}

if (commentForm) {
    commentForm.addEventListener("submit", handleSubmit)
}