import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeepPartial,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MusicEntity } from './music.entity';

export const MusicSourceMelonEntityFixture: DeepPartial<MusicSourceMelonEntity>[] =
  [
    {
      songId: 32632368,
      songTitle: '夜に駆ける',
      artistName: 'YOASOBI',
      artistThumbnail:
        'https://cdnimg.melon.co.kr/cm2/artistcrop/images/028/71/809/2871809_20210603175336.jpg',
      category: 'J-POP',
      albumTitle: '夜に駆ける (밤을 달리다, Into The Night / Yoru ni Kakeru)',
      albumThumbnail200:
        'https://cdnimg.melon.co.kr/cm2/album/images/104/37/023/10437023_20200528185316_200.jpg',
      albumThumbnail500:
        'https://cdnimg.melon.co.kr/cm2/album/images/104/37/023/10437023_20200528185316_500.jpg',
      albumThumbnail1000:
        'https://cdnimg.melon.co.kr/cm2/album/images/104/37/023/10437023_20200528185316_1000.jpg',
      lyrics:
        '沈むように溶けてゆくように\n시즈무요-니 토케테 유쿠요-니\n가라앉듯이, 녹아가듯이\n\n​二人だけの空が広がる夜に\n후타리 다케노 소라가 히로가루 요루니\n둘만의 하늘이 펼쳐지는 밤에\n\n「さよなら」 だけだった\n사요나라 다케닷타\n「잘 있어」뿐이었어\n\nその一言で全てが分かった\n소노 히토코토데 스베테가 와캇타\n그 한마디로 모든 것을 알았어\n\n日が沈み出した空と君の姿\n히가 시즈미 다시타 소라토 키미노 스가타\n해가 저물기 시작한 하늘과 너의 뒷모습\n\nフェンス越しに重なっていた\n휀스 고시니 카사낫테 이타\n펜스 너머에 겹쳐져 있었어\n\n初めて会った日から\n하지메테 앗타 히카라\n처음으로 만난 날부터\n\n僕の心の全てを奪った\n보쿠노 코코로노 스베테오 우밧타\n내 마음의 모두를 빼앗았어\n\nどこか儚い空気を纏う君は\n도코카 하카나이 쿠-키오 마토우 키미와\n어딘가 허무한 분위기를 휘감은 너는\n\n寂さみしい目をしてたんだ\n사미시이 메오 시테탄다\n외로운 눈을 하고 있었어\n\nいつだってチックタックと鳴る世界で何度だってさ\n이츠닷테 칫쿠탓쿠토 나루 세카이데 난도닷테사\n언제든지 째깍째깍하고 울리는 세계에서 몇 번이고 말야\n\n触れる心無い言葉うるさい声に\n후레루 코코로 나이 코토바 우루사이 코에니\n느껴지는 감정이 없는 말과 시끄러운 소리에\n\n涙が零れそうでも\n나미다가 코보레 소-데모\n눈물이 흘러넘칠 것 같아도\n\nありきたりな喜び\n아리키타리나 요로코비\n흔해빠진 기쁨을\n\nきっと二人なら見つけられる\n킷토 후타리나라 미츠케라레루\n분명 우리 둘이라면 찾을 수 있어\n\n騒がしい日々に笑えない君に\n사와가시이 히비니 와라에나이 키미니\n소란스러운 나날에 웃을 수 없는 너에게\n\n思い付く限り眩しい明日を\n오모이 츠쿠 카기리 마부시이 아스오\n생각나는 한 눈부신 내일을\n\n開けない夜に落ちてゆく前に\n아케나이 요루니 오치테 유쿠 마에니\n밝아오지 않는 밤에 떨어지기 전에\n\n僕の手を掴んでほら\n보쿠노 테오 츠칸데 호라\n내 손을 잡고, 자\n\n忘れてしまいたくて閉じ込めた日々も\n와스레테 시마이타쿠테 토지 코메타 히비모\n잊어버리고 싶어서 가둬두었던 나날도\n\n抱きしめた温もりで溶かすから\n다키시메타 누쿠모리데 토카스카라\n껴안고 있던 따스함으로 녹일 테니까\n\n怖くないよいつか日が昇るまで\n코와쿠 나이요 이츠카 히가 노보루마데\n무섭지 않아, 언젠가 해가 뜰 때까지\n\n二人でいよう\n후타리데 이요-\n둘이서 있자\n\n君にしか見えない\n키미니시카 미에나이\n너 말고는 볼 수 없는\n\n何かを見つめる君が嫌いだ\n나니카오 미츠메루 키미가 키라이다\n무언가를 바라보는 네가 싫어\n\n見惚れているかのような恋するような\n미토레테 이루카노 요-나 코이 스루 요-나\n빠져있는 듯한, 사랑을 하는 듯한\n\nそんな顔が嫌いだ\n손나 카오가 키라이다\n그런 얼굴이 싫어\n\n信じていたいけど信じれないこと\n신지테 이타이케도 신지레나이 코토\n믿고 싶지만 믿을 수 없는 것\n\nそんなのどうしたってきっと\n손나노 도-시탓테 킷토\n그런 건 어찌해봐도 분명\n\nこれからだっていくつもあって\n코레카라 닷테 이쿠츠모 앗테\n앞으로 몇 번이고 있을 거고\n\nそのたんび怒って泣いていくの\n소노 탄비 오콧테 나이테 이쿠노\n그럴 때마다 화내고 우는 거야\n\nそれでもきっといつかはきっと僕らはきっと\n​소레데모 킷토 이츠카와 킷토 보쿠라와 킷토\n그래도 분명, 언젠가는 분명, 우리는 분명\n\n分かり合えるさ信じてるよ\n와카리 아에루사 신지테루요\n서로 이해할 수 있을 거야, 믿고 있어\n\nもう嫌だって疲れたんだって\n모- 이야닷테 츠카레탄닷테\n이젠 싫다고, 지쳤다고\n\nがむしゃらに差し伸べた僕の手を振り払う君\n가무샤라니 사시노베타 보쿠노 테오 후리하라우 키미\n무작정 내민 내 손을 뿌리치는 너\n\nもう嫌だって疲れたよなんて\n모- 이야닷테 츠카레타요난테\n이젠 싫다고, 지쳤다고\n\n本当は僕も言いたいんだ\n혼토-와 보쿠모 이이타인다\n사실은 나도 말하고 싶어\n\nほらまたチックタックと鳴る世界で何度だってさ\n호라 마타 칫쿠탓쿠토 나루 세카이데 난도닷테사\n봐, 다시 째깍째깍하고 울리는 세계에서 몇 번이고 말야\n\n君の為に用意した言葉どれも届かない\n키미노 타메니 요-이시타 코토바 도레모 토도카나이\n너를 위해 준비한 말, 그 어떤 것도 닿지 않아\n\n「終わりにしたい」だなんてさ\n오와리니 시타이다 난테사\n「끝내고 싶어」라고\n\n釣られて言葉にした時\n츠라레테 코토바니 시타 토키\n이끌려서 말을 내뱉었을 때\n\n君は初めて笑った\n키미와 하지메테 와랏타\n너는 처음으로 웃었어\n\n騒がしい日々に笑えなくなっていた\n사와가시이 히비니 와라에나쿠 낫테 이타\n소란스러운 나날에 웃을 수 없게 되어있던\n\n僕の目に映る君は綺麗だ\n보쿠노 메니 우츠루 키미와 키레이다\n내 눈에 비친 너는 아름다워\n\n開けない夜に溢れた涙も\n아케나이 요루니 코보레타 나미다모\n밝아오지 않는 밤에 흘러넘친 눈물도\n\n君の笑顔に溶けていく\n키미노 에가오니 토케테 이쿠\n너의 웃는 얼굴에 녹아내려가\n\n変わらない日々に泣いていた僕を\n카와라나이 히비니 나이테 이타 보쿠오\n변함없는 나날에 울고 있던 나를\n\n君は優しく終わりへと誘う\n키미와 야사시쿠 오와리에토 사소우\n너는 친절하게 마지막으로 이끌어\n\n沈むように溶けてゆくように\n시즈무요-니 토케테 유쿠요-니\n가라앉듯이, 녹아가듯이\n\n染み付いた霧が晴れる\n시미 츠이타 키리가 하레루\n얼룩진 안개가 걷혀\n\n忘れてしまいたくて閉じ込めた日々に\n와스레테 시마이타쿠테 토지 코메타 히비니\n잊어버리고 싶어서 가둬두었던 나날에\n\n差し伸べてくれた君の手を取る\n사시노베테 쿠레타 키미노 테오 토루\n내밀어준 너의 손을 잡아\n\n涼しい風が空を泳ぐように\n스즈시이 카제가 소라오 오요구요-니\n선선한 바람이 하늘을 헤엄치듯이\n\n今吹き抜けていく\n이마 후키 누케테 유쿠\n지금 불며 지나가고 있어\n\n繋いだ手を離さないでよ\n츠나이다 테오 하나사나이데요\n잡은 손을 놓지 말아줘\n\n二人今、夜に駆け出していく\n후타리 이마, 요루니 카케 다시테 이쿠\n두 사람 지금, 밤을 달려나가고 있어',
      releasedAt: new Date('2019-12-14T15:00:00.000Z'),
    },
    {
      songId: 35535827,
      songTitle: 'NIGHT DANCER',
      artistName: 'imase',
      artistThumbnail:
        'https://cdnimg.melon.co.kr/cm2/artistcrop/images/030/60/228/3060228_20230203164411.jpg',
      category: 'J-POP',
      albumTitle: 'NIGHT DANCER',
      albumThumbnail200:
        'https://cdnimg.melon.co.kr/cm2/album/images/110/31/616/11031616_20220817122214.jpg',
      albumThumbnail500:
        'https://cdnimg.melon.co.kr/cm2/album/images/110/31/616/11031616_20220817122214_500.jpg',
      albumThumbnail1000:
        'https://cdnimg.melon.co.kr/cm2/album/images/110/31/616/11031616_20220817122214_1000.jpg',
      lyrics:
        'どうでもいいような 夜だけど\n도오데모 이이요오나 요루다케도\n아무래도 좋을 것 같은 밤이지만\n \n響めき 煌めきと君も\n도효메 키키라메키토 키미모\n울리는 소리와 반짝임과 당신도\n \nまだ止まった 刻む針も\n마다 토맛타 키자무하리모\n아직 멈추어 있는 시계의 바늘도\n \n入り浸った 散らかる部屋も\n이리비탓타 치라카루 헤야모\n어지러져 있는 방도\n \n変わらないね 思い出しては\n카와라나이네 오모이다시테와\n변하지 않을거야 생각서는\n \n二人 歳を重ねてた ah\n후타리 토시오 카사네테타 ah\n둘이서 나이를 먹었지 ah\n \nまた止まった 落とす針を\n마타 토맛타 오토스하리오\n다시 멈춘 LP플레이어의 바늘을\n \nよく流した 聞き飽きるほど\n요쿠 나가시타 키키아키루호도\n듣기 지칠 정도로 흘려 들었지\n \n変わらないね 変わらないで\n카와라나이네 카와라나이데\n변하지 않는구나, 변하지 말아줘\n \nいられたのは 君だけか ah\n이라레타노와 키미다케카 ah\n같이 있을 수 있었던 것은 너뿐이야 ah\n \n無駄話で はぐらかして\n무다바나시데 하구라카시테\n잡담으로 흘리며\n \n触れた先を ためらうように\n후레타 사키오 타메라우요오니\n말하기를 머물거리며\n \n足踏みして ズレた針を余所に\n아시부미시테 즈레타 하리오 요소니\n발을 동동 구르며 삐뚤러진 시계 바늘을 다른 곳으로\n \n揃い始めてた 息が\n소로이하지메테타 이키가\n멎기 시작했어 숨이\n \nどうでもいいような 夜だけど\n도오데모 이이요오나 요루다케도\n아무래도 좋을 것 같은 밤이지만\n \n響めき 煌めきと君も "踊ろう"\n도효메 키키라메키토 키미모 오도로오\n울리는 소리와 반짝임과 당신도 함께 "춤춰"\n \nどうでもいいような 夜だけど\n도오데모 이이요오나 요루다케도\n아무래도 좋을 것 같은 밤이지만\n \nAh 二人刻もう\nah 후타리 키자모오\nah 둘이서 새기자\n \nTu-tu-lu-tu-lu\n \n透き通った 白い肌も\n키토오쯔타 시로이 하다모\n맑은 하얀 피부도\n \nその笑った 無邪気な顔も\n소노 와랏타 무자키나 카오모\n그 웃는 무고한 얼굴도\n \n変わらないね 変わらないで\n카와라나이네 카와라나이데\n변하지 않는구나, 변하지말아줘\n \nいられるのは 今だけか ah ah ah\n이라레루노와 이마다케카 ah ah ah\n이대로 있을 수 있는건 지금뿐이야 ah ah ah\n \n見つめるほどに\n미츠메루호도니\n보면 볼수록\n \n溢れる メモリー\n아후레루 메모리이\n흘러오는 추억\n \n浮つく心に コーヒーを\n우와츠쿠 코코로니 코오히이오\n떠있는 마음에 커피를\n \n乱れたヘアに 掠れたメロディー\n미다레타 헤아니 카스레타 메로디이\n난장판인 방에서 나오는 낡은 멜로디\n \n混ざりあってよう もう一度\n마자리앗테 요오 모오이치도\n다시 엉켜 보자\n \nどうでもいいような 夜だけど\n도오데모 이이요오나 요루다케도\n아무래도 좋을 것 같은 밤이지만\n \nときめき 色めきと君も "踊ろう"\n토키메키 이로메키토 키미모 오도로오\n설렘이 가득한 너도 "춤춰"\n \nどうでもいいような 夜だけど\n도오데모 이이요오나 요루다케도\n아무래도 좋을 것 같은 밤이지만\n \nAh 二人刻もう\nah 후타리 키자모오\nah 둘이서 새기자\n \nTu-tu-lu-tu-lu\n \n夜は長い おぼつかない\n요루와 나가이 오보츠카나이\n밤을 길고 안정되지 않아\n \n今にも止まりそうな ミュージック\n이마니모 토마리소오나 뮤우짓쿠\n지금이라도 멈출 것만 같은 음악\n \n君といたい 溺れてたい\n키미토 이타이 오보레테타이\n너와 함께 있고 싶어, 빠지고 싶어\n \n明日がこなくたって もういいの\n아시타가 코나쿠탓테 모오 이이노\n내일이 오지 않는다고 해도 괜찮아\n \nどうでもいいような 夜だけど\n도오데모 이이요오나 요루다케도\n아무래도 좋을 것 같은 밤이지만\n \n響めき 煌めきと君も "踊ろう"\n도요메 키키라메키토 키미모 오도로오\n울리는 소리와 반짝임과 당신도 함께 "춤춰"\n \nどうでもいいような 夜だけど ah\n도오데모 이이요오나 요루다케도 ah\n아무래도 좋을 것 같은 밤이지만 ah\n \nAh 愛して\nah 아이시테\nah 사랑해줘\n \nどうでもいいから 僕だけを\n도오데모 이이카라 보쿠다케오\n아무래도 좋으니까 나만을\n \nふらつき よろめきながらも "踊ろう"\n후라츠키 요로메키나가라모 오도로오\n비틀거리며 비틀거리면서도 "춤추자"\n \nどうでもいいような 夜だけど\n도오데모 이이요오나 요루다케도\n아무래도 좋을 것 같은 밤이지만\n \nAh 二人刻もう\nah 후타리 키자모오\nah 둘이서 새기자',
      releasedAt: new Date('2022-08-18T15:00:00.000Z'),
    },
  ];

export async function loadMusicSourceMelonEntityFixture() {
  const fixture = MusicSourceMelonEntityFixture.map(
    (data) => new MusicSourceMelonEntity(data),
  );
  await MusicSourceMelonEntity.save(fixture);
}

@Entity('music-source-melon')
export class MusicSourceMelonEntity extends BaseEntity {
  constructor(_musicSourceMelonEntity?: DeepPartial<MusicSourceMelonEntity>) {
    super();
    if (_musicSourceMelonEntity)
      for (const key of Object.keys(_musicSourceMelonEntity)) {
        this[key] = _musicSourceMelonEntity[key];
      }
  }

  @PrimaryColumn()
  @ApiProperty({
    description: 'melon 음원 ID (number)',
    type: Number,
    example: 12345678,
  })
  songId: number;
  @Column()
  @ApiProperty({
    description: 'melon 음원 제목',
    type: String,
    example: '음원 제목',
  })
  songTitle: string;
  @Column()
  @ApiProperty({
    description: 'melon 음원 가수명',
    type: String,
    example: '음원 가수명',
  })
  artistName: string;
  @Column()
  @ApiProperty({
    description: 'melon 음원 가수 프로필이미지',
    type: String,
    example: 'https://example.com/thumbnail.jpg',
  })
  artistThumbnail: string;
  @Column()
  @ApiProperty({
    description: 'melon 음원 장르',
    type: String,
    example: 'J-POP',
  })
  category: string;
  @Column()
  @ApiProperty({
    description: 'melon 앨범 제목',
    type: String,
    example: '앨범 제목',
  })
  albumTitle: string;
  @Column()
  @ApiProperty({
    description: 'melon 앨범 자켓이미지 200*200px',
    type: String,
    example: 'https://example.com/thumbnail.jpg',
  })
  albumThumbnail200: string;
  @Column()
  @ApiProperty({
    description: 'melon 앨범 자켓이미지 500*500px',
    type: String,
    example: 'https://example.com/thumbnail.jpg',
  })
  albumThumbnail500: string;
  @Column()
  @ApiProperty({
    description: 'melon 앨범 자켓이미지 1000*1000px',
    type: String,
    example: 'https://example.com/thumbnail.jpg',
  })
  albumThumbnail1000: string;
  @Column('text')
  @ApiProperty({
    description: 'melon 음원 가사',
    type: String,
    example: '대충 가사 텍스트.',
  })
  lyrics: string;
  @Column('datetime')
  @ApiProperty({
    description: 'melon 음원 발매일 (ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  releasedAt: Date;
  @CreateDateColumn()
  @ApiProperty({
    description:
      'melon 음원 등록 생성타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  createdAt: Date;
  @UpdateDateColumn()
  @ApiProperty({
    description:
      'melon 음원 등록 수정타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    example: '2023-02-27T13:02:00.650Z',
  })
  updatedAt: Date;
  @DeleteDateColumn()
  @ApiProperty({
    description:
      'melon 음원 등록 삭제타임스템프(ISO8601, YYYY-MM-DDTHH:mm:ss.sssZ)',
    type: String,
    nullable: true,
    example: '2023-02-27T13:02:00.650Z',
  })
  deletedAt: Date;

  @OneToMany(() => MusicEntity, (music) => music.musicSourceMelon, {
    cascade: true,
  })
  @ApiProperty({
    description: '수록곡 배열',
    type: () => [MusicEntity],
  })
  musics: MusicEntity[];
}
