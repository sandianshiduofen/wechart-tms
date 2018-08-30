import {dealChatTime} from "../../utils/time";

/**
 * 这个类是IM模拟类，作为示例仅供参考。
 */
export default class IMOperator {
  static VoiceType = 'voice';
  static TextType = 'text';
  static ImageType = 'image';
  static CustomType = 'custom';
  static CallType = 'call';

  constructor(page) {
      this._page = page;
      this._latestTImestamp = 0;//最新消息的时间戳
      this._myHeadUrl = '../../image/my_head.jpeg';
      this._otherHeadUrl = '../../image/other_head.jpg';
  }


  onSimulateReceiveMsg(cbOk) {
      this.onSimulateReceiveMsgCb = cbOk;
  }

  onSimulateSendMsg({content, success, fail}) {
      //这里content即为要发送的数据
      setTimeout(() => {
          //这里的content是一个JSON格式的字符串，类似于：{"content":"233","type":"text"}
          const item = this.createNormalChatItem(JSON.parse(content));
          this._latestTImestamp = item.timestamp;

          //使用随机数来模拟数据发送失败情况
          const isSendSuccess = parseInt(Math.random() * 100) > 35;
          console.log('随机数模拟是否发送成功', isSendSuccess);
          const isChatClose = this._page.data.chatStatue === 'close';
          if (isSendSuccess || isChatClose) {
              success && success(item);
          } else {
              fail && fail();
          }
          if (isChatClose || !isSendSuccess) return;
          setTimeout(() => {

              const item = this.createNormalChatItem({type: 'text', content: '这是模拟好友回复的消息', isMy: false});
              // const item = this.createNormalChatItem({type: 'voice', content: '上传文件返回的语音文件路径', isMy: false});
              // const item = this.createNormalChatItem({type: 'image', content: '上传文件返回的图片文件路径', isMy: false});
              this._latestTImestamp = item.timestamp;
              //这里是收到好友消息的回调函数，建议传入的item是 由 createNormalChatItem 方法生成的。
              this.onSimulateReceiveMsgCb && this.onSimulateReceiveMsgCb(item);
          }, 1000);
      }, 300);

  }

  static createChatItemContent({type = IMOperator.TextType, content = '', duration} = {}) {
      if (!content.replace(/^\s*|\s*$/g, '')) return;
      return JSON.stringify({content, type, duration});
  }

  createNormalChatItem({type = IMOperator.TextType, content = '', isMy = true, duration} = {}) {
      if (!content) return;
      const currentTimestamp = Date.now();
      const time = dealChatTime(currentTimestamp, this._latestTImestamp);
      let obj = {
          msgId: 0,//消息id
          friendId: 0,//好友id
          isMy: isMy,//我发送的消息？
          showTime: time.ifShowTime,//是否显示该次发送时间
          time: time.timeStr,//发送时间 如 09:15,
          timestamp: currentTimestamp,//该条数据的时间戳，一般用于排序
          type: type,//内容的类型，目前有这几种类型： text/voice/image/custom | 文本/语音/图片/自定义
          content: content,// 显示的内容，根据不同的类型，在这里填充不同的信息。
          headUrl: isMy ? this._myHeadUrl : this._otherHeadUrl,//显示的头像，自己或好友的。
          sendStatus: 'success',//发送状态，目前有这几种状态：sending/success/failed | 发送中/发送成功/发送失败
          voiceDuration: duration,//语音时长 单位秒
          isPlaying: false,//语音是否正在播放
      };
      obj.saveKey = obj.friendId + '_' + obj.msgId;//saveKey是存储文件时的key
      return obj;
  }

  static createCustomChatItem() {
    return {
      timestamp: Date.now(),
      type: IMOperator.CustomType,
      content: '会话已关闭'
    }
  }
  static createCallChatItem() {
    return {
      timestamp: Date.now(),
      type: IMOperator.CallType,
      content: '拨打了电话'
    }
  }

}

