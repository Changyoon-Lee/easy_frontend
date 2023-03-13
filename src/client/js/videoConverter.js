import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const articleForm = document.getElementById("uploadForm")
const uploadBtn = document.getElementById("uploadBtn");
articleForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("submited");
    document.body.style.cursor = "wait";
    const ffmpeg = createFFmpeg({ log: false })
    await ffmpeg.load()
    const inputFile = articleForm.querySelector("#video").files[0];
    if (inputFile) {
        ffmpeg.FS("writeFile", "target", await fetchFile(inputFile))
        await ffmpeg.run("-i", "target", "-t", "5", "-r", "20", "ouput.mp4")
        const mp4File = ffmpeg.FS("readFile", "ouput.mp4")
        const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });

        articleForm.querySelector("#video").remove();
        console.log(articleForm);
        let formData = new FormData(articleForm);
        formData.append("video", mp4Blob, "output.mp4")
        fetch("/article/create", { method: "POST", body: formData, }).then((res) => {
            console.log("done")
            window.location.href = "/" // fetch로는 redirect 안돼어 수동으로 해주어야함 
        })
    } else {
        console.log("file 없는 경우 코드")
        articleForm.querySelector("#video").remove()
        let formData = new FormData(articleForm);
        fetch("/article/create", { method: "POST", body: formData }).then((res) => {
            console.log("done")
            console.log(res.url)
            console.log(res)
            window.location.href = "/"; // fetch로는 redirect 안돼어 수동으로 해주어야함 
        })
    }
})

// btn 기능
const exitBtn = document.getElementById("exitBtn")
exitBtn.addEventListener("click", () => { history.back() })
