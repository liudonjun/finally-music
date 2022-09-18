import { ref, watch, computed, nextTick } from 'vue'

export default function useFixed(props:any) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)//列表容器
  const listHeights = ref([]) //列表高度
  const scrollY = ref(0) //滚动条位置
  const currentIndex = ref(0) //当前列表索引
  const distance = ref(0) //当前列表距离顶部距离

  // 获取当前是哪个字母
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value] //当前列表
    return currentGroup ? currentGroup.title : ''
  })

  // 字母卡片样式
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })

  //监听滚动条位置
  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })

  //监听滚动条位置
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  //计算列表高度
  function calculate() {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0

    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }

  //滚动条滚动
  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
