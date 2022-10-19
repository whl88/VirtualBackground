import VideoBackgroundProcessor from './VideoBackgroundProcessor'
const processor = new VideoBackgroundProcessor()

navigator.mediaDevices.getUserMedia({
    video:{
        width: 1920, 
        height: 1080,
        frameRate: { 
            ideal: 25, 
            max: 30,
        },
     },
    audio:false,
}).then(async (stream)=>{
    await processor.init(stream)
    const s = await processor.getOutputStream()
    document.querySelector('#self').srcObject = s
})

document.querySelector('#blur').addEventListener('click', function(){
    processor.setBackgroundBlurring(3)
})

document.querySelector('#color').addEventListener('click', function(){
    processor.setBackgroundColor()
})

document.querySelector('#image').addEventListener('click', function(){
    processor.setBackgroundImage('./test.jpg')
})

document.querySelector('#cancel').addEventListener('click', function(){
    processor.clearEffect()
})