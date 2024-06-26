import UIAbility from '@ohos.app.ability.UIAbility';
import hilog from '@ohos.hilog';
import window from '@ohos.window';
import Want from '@ohos.app.ability.Want';
import AbilityConstant from '@ohos.app.ability.AbilityConstant';

/**
 * UIAbility 是一种包含用户界面的应用组件，主要用于和用户进行交互。UIAbility 也是系统调度的单元，为应用提供窗口在其中绘制界面。
 *
 * 每一个 UIAbility 实例，都对应于一个最近任务列表中的任务。
 *
 * 一个应用可以有一个 UIAbility，也可以有多个 UIAbility，例如：
 *
 *    浏览器应用可以通过一个 UIAbility 结合多页面的形式让用户进行的搜索和浏览内容；
 *
 *    而聊天应用增加一个“外卖功能”的场景，则可以将聊天应用中“外卖功能”的内容独立为一个
 *    UIAbility，当用户打开聊天应用的“外卖功能”，查看外卖订单详情，此时有新的聊天
 *    消息，即可以通过最近任务列表切换回到聊天窗口继续进行聊天对话。
 *
 * 一个 UIAbility 可以对应于多个页面，建议将一个独立的功能模块放到一个 UIAbility 中，以多页面的形式呈现。
 * 例如新闻应用在浏览内容的时候，可以进行多页面的跳转使用。
 *
 * UIAbility 的数据传递：
 *
 *    UIAbility 内页面的跳转和数据传递
 *    UIAbility 间的数据跳转和数据传递
 *
 * 对于 UIAbility 内页面的跳转和数据传递，需要使用 '@ohos.router' 提供的路由功能。
 *
 * UIAbility 的生命周期包括 Create、Foreground、Background、Destroy 四个状态。WindowStageCreate 和 WindowStageDestroy
 * 为窗口管理器（WindowStage）在 UIAbility 中管理 UI 界面功能的两个生命周期回调，从而实现 UIAbility 与窗口之间的弱耦合。
 *
 * UIAbility 的启动模式：UIAbility 当前支持 singleton（单实例模式）、multiton（多实例模式）和 specified（指定实例模式）3 种启动模式。
 *
 *    - singleton（单实例模式） ：singleton 启动模式为单实例模式，也是默认情况下的启动模式。每次调用 startAbility() 方法时，如果应用进
 *      程中该类型的 UIAbility 实例已经存在，则复用系统中的 UIAbility 实例。系统中只存在唯一一个该 UIAbility 实例，即在最近任务列表中只
 *      存在一个该类型的 UIAbility 实例。
 *    - multiton（多实例模式）：multiton 启动模式为多实例模式，每次调用 startAbility() 方法时，都会在应用进程中创建一个新的该类型 UIAbility
 *      实例。即在最近任务列表中可以看到有多个该类型的 UIAbility 实例。
 *    - specified（指定实例模式）：specified 启动模式为指定实例模式，针对一些特殊场景使用（例如文档应用中每次新建文档希望都能新建一个文档实例，
 *      重复打开一个已保存的文档希望打开的都是同一个文档实例）。
 *
 *
 *
 */
export default class EntryAbility extends UIAbility {

  /*
   Create 状态，在 UIAbility 实例创建时触发，系统会调用 onCreate 回调。可以在 onCreate 回调中进行相关初始化操作。
   例如用户打开电池管理应用，在应用加载过程中，在 UI 页面可见之前，可以在 onCreate 回调中读取当前系统的电量情况，用于
   后续的 UI 页面展示。
   */
  onCreate(want, launchParam) {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onCreate');
  }

  /*
  UIAbility 实例创建完成之后，在进入 Foreground 之前，系统会创建一个 WindowStage。每一个 UIAbility 实例都对应持有一个 WindowStage 实例。

  WindowStage 为本地窗口管理器，用于管理窗口相关的内容，例如与界面相关的获焦/失焦、可见/不可见。

  可以在 onWindowStageCreate 回调中，设置 UI 页面加载、设置 WindowStage 的事件订阅。在 onWindowStageCreate(windowStage)
  中通过 loadContent 接口设置应用要加载的页面。

  例如用户打开游戏应用，正在打游戏的时候，有一个消息通知，打开消息，消息会以弹窗的形式弹出在游戏应用的上方，此时，游戏应用就从获焦切换到了失焦状态，消
  息应用切换到了获焦状态。对于消息应用，在 onWindowStageCreate 回调中，会触发获焦的事件回调，可以进行设置消息应用的背景颜色、高亮等操作。
  */
  onWindowStageCreate(windowStage: window.WindowStage) {
    // Main window is created, set main page for this ability
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageCreate');

    windowStage.loadContent('pages/Index', (err, data) => {
      if (err.code) {
        hilog.error(0x0000, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
        return;
      }
      hilog.info(0x0000, 'testTag', 'Succeeded in loading the content. Data: %{public}s', JSON.stringify(data) ?? '');
    });
  }

  /*
  Foreground 和 Background状态，分别在 UIAbility 切换至前台或者切换至后台时触发。分别对应于 onForeground 回调 和onBackground 回调。

  onForeground 回调，在 UIAbility 的 UI 页面可见之前，即 UIAbility 切换至前台时触发。可以在 onForeground 回调中申请系统需要的资源，
  或者重新申请在 onBackground 中释放的资源。
  */
  onForeground() {
    // Ability has brought to foreground
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onForeground');
  }

  /*
   onBackground 回调，在 UIAbility 的 UI 页面完全不可见之后，即 UIAbility 切换至后台时候触发。可以在 onBackground 回调中释放 UI 页面
   不可见时无用的资源，或者在此回调中执行较为耗时的操作，例如状态保存等。

   例如用户打开地图应用查看当前地理位置的时候，假设地图应用已获得用户的定位权限授权。在 UI 页面显示之前，可以在 onForeground 回调中打开定位功
   能，从而获取到当前的位置信息。当地图应用切换到后台状态，可以在 onBackground 回调中停止定位功能，以节省系统的资源消耗。
   */
  onBackground() {
    // Ability has back to background
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onBackground');
  }

  /*
   前面我们了解了 UIAbility 实例创建时的 onWindowStageCreate 回调的相关作用。对应于 onWindowStageCreate 回调。在 UIAbility 实例销毁
   之前，则会先进入 onWindowStageDestroy 回调，我们可以在该回调中释放 UI 页面资源。

   例如在 onWindowStageCreate 中设置的获焦/失焦等 WindowStage 订阅事件。
   */
  onWindowStageDestroy() {
    // Main window is destroyed, release UI related resources
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
  }

  /*
   Destroy 状态，在 UIAbility 销毁时触发。可以在 onDestroy 回调中进行系统资源的释放、数据的保存等操作。例如用户使用应用的程序退出功能，会
   调用 UIAbilityContext 的 terminalSelf() 方法，从而完成 UIAbility 销毁。或者用户使用最近任务列表关闭该 UIAbility 实例时，也会完成
   UIAbility的 销毁。
   */
  onDestroy() {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onDestroy');
  }

  /* 启动一个 specified ability 时触发的事件。*/
  onAcceptWant(want: Want): string {
    return "";
  }

  /*
   启动一个 specified ability 时触发的事件。当 onAcceptWant 分发返回的 key 对应一个已经存在的 UIAbility
   实例，则该实例的 onNewWant 分发被调用 】。
   */
  onNewWant(want: Want, launchParams: AbilityConstant.LaunchParam): void {

  }
}