import AgoraRTC from "agora-rtc-sdk-ng";
import VirtualBackgroundExtension from "agora-extension-virtual-background";
import Event from './event'

const extension = new VirtualBackgroundExtension();

export default class VideoBackgroundProcessor extends Event{
  constructor(){
    super()
    // 注册插件
    AgoraRTC.registerExtensions([extension]);
  }

  async init(stream) {
    this.inputStream = stream
    this.videoTrack = await AgoraRTC.createCustomVideoTrack({
      mediaStreamTrack: stream.getVideoTracks()[0],
    })

    if (!this.processor && this.videoTrack) { // 初始化 processor
      this.processor = extension.createProcessor();
      await this.processor.init("./assets/wasms");
      this.videoTrack.pipe(this.processor).pipe(this.videoTrack.processorDestination);
    }
  }

  /**
   * 背景模糊
   * @param {number} blurDegree 背景模糊等级，范围1-3，值越大越模糊。
   */
  async setBackgroundBlurring(blurDegree = 2) {
    if (this.videoTrack && this.processor) {
      this.processor.setOptions({type: 'blur', blurDegree});
      await this.processor.enable();
    }else{
      this.emit('error','videoTrack or processor is not defined, please call init function first')
    }
  }

  /**
   * 设置背景色
   * @param {string} color 色值。默认绿幕 #00ff00
   */
   async setBackgroundColor(color = '#00ff00') {
    if (this.videoTrack && this.processor) {
      this.processor.setOptions({type: 'color', color})
      await this.processor.enable();
    }else{
      this.emit('error','videoTrack or processor is not defined, please call init function first')
    }
  }

  /**
   * 设置背景图片
   * @param {string} url 背景图url
   */
   async setBackgroundImage(url) {
    if (url && this.videoTrack && this.processor) {
      const imgElement = document.createElement('img')
      imgElement.onload = async() => {
        this.processor.setOptions({type: 'img', source: imgElement})
        await this.processor.enable()
      }
      imgElement.src = url
    }else{
      this.emit('error','videoTrack or processor is not defined, please call init function first')
    }
  }

  async clearEffect(){
    return this.processor.disable()
  }

  async getOutputStream(){
    return new MediaStream([await this.processor.getProcessedTrack()])
  }
}