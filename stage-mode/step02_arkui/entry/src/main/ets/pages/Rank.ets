import prompt from '@ohos.promptAction';
import { RankViewModel } from '../feature/rank/viewmodel/RankViewModel';
import { RankData } from '../feature/rank/data/RankData';
import { ListHeaderComponent } from '../feature/rank/view/RankListHeader';
import { TitleComponent } from '../feature/rank/view/RankTitle';
import { ListItemComponent } from '../feature/rank/view/RankListItem';
import { APP_EXIT_INTERVAL, Style, TIME, TITLE, WEIGHT } from '../feature/rank/common/Constant';

let rankModel: RankViewModel = new RankViewModel();


@Entry
@Component
struct Rank {
  @State dataSource1: RankData[] = [];
  @State dataSource2: RankData[] = [];
  // The State is used to decide whether to switch the data of RankList.
  @State isSwitchDataSource: boolean = true;
  // It will record the time of clicking back button of system navigation.
  private clickBackTimeRecord: number = 0;

  aboutToAppear() {
    this.dataSource1 = rankModel.loadRankDataSource1();
    this.dataSource2 = rankModel.loadRankDataSource2();
  }

  onBackPress() {
    if (this.isShowToast()) {
      prompt.showToast({
        message: $r('app.string.prompt_text'),
        duration: TIME
      });
      this.clickBackTimeRecord = new Date().getTime();
      return true;
    }
    return false;
  }

  isShowToast(): boolean {
    return new Date().getTime() - this.clickBackTimeRecord > APP_EXIT_INTERVAL;
  }

  build() {
    Column() {
      // Title component in the top.
      TitleComponent({ isRefreshData: $isSwitchDataSource, title: TITLE })

      // The head style of List component.
      ListHeaderComponent({
        paddingValue: {
          left: Style.RANK_PADDING,
          right: Style.RANK_PADDING
        },
        widthValue: Style.CONTENT_WIDTH
      })
        .margin({
          top: Style.HEADER_MARGIN_TOP,
          bottom: Style.HEADER_MARGIN_BOTTOM
        })

      // The style of List component.
      this.RankList(Style.CONTENT_WIDTH)
    }
    .backgroundColor($r('app.color.background'))
    .height(WEIGHT)
    .width(WEIGHT)
  }

  @Builder RankList(widthValue: Length) {
    Column() {
      List() {
        ForEach(this.isSwitchDataSource ? this.dataSource1 : this.dataSource2,
          (item: RankData, index?: number) => {
            ListItem() {
              ListItemComponent(
                { index: (Number(index) + 1),
                  name: item.name,
                  vote: item.vote,
                  isSwitchDataSource: this.isSwitchDataSource
                }
              )
            }
          }, (item: RankData) => JSON.stringify(item))
      }
      .width(WEIGHT)
      .height(Style.LIST_HEIGHT)
      .divider({ strokeWidth: Style.STROKE_WIDTH })
    }
    .padding({
      left: Style.RANK_PADDING,
      right: Style.RANK_PADDING
    })
    .borderRadius(Style.BORDER_RADIUS)
    .width(widthValue)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor(Color.White)
  }
}