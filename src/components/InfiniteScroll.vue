<template>
  <div class='infinite-scroll'>
    <ul class='infinite-scroll-wraper'>
      <li
        v-for='(item,index) in virtualList'
        :style='{top : height * (index + start) + "px"}'
        :id='(index == 0 ? "top" : (index == (virtualList.length -1) ? "bottom" : ""))'
        class='infinite-scroll-item'
      >{{item}}</li>
    </ul>
  </div>
</template>

<script>
const THRESHOLD = 15;
export default {
  name: "InfiniteScroll",
  data() {
    return {
      start: 0,
      end: 10,
      virtualList: [],
      oberver: null
    };
  },
  props: {
    realList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    height: {
      type: Number,
      default: 100
    }
  },
  mounted() {
    this.$nextTick(() => {
      //需要nextTick后才能获取到props的值
      this.afterAll();
    });
  },
  methods: {
    afterAll() {
      //实际显示的数据是从真实数组截取start到end条
      this.virtualList = this.realList.slice(this.start, this.end);
      this.$nextTick(() => {
        this.intiateScrollObserver();
      });
    },
    intiateScrollObserver() {
      //监听事件
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      };
      //IntersectionObserver用法链接[https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver]
      this.observer = new IntersectionObserver(this.callback, options);
      //数组中第一个数据id为top，最后一个id为bottom
      let top = document.querySelector("#top");
      let bottom = document.querySelector("#bottom");
      //分别检测第一个和最后一个元素
      if (top) {
        this.observer.observe(top);
      }
      if (bottom) {
        this.observer.observe(bottom);
      }
    },
    callback(entries) {
      entries.forEach((entry, index) => {
        const listLength = this.realList.length;
        const start = this.start,
          end = this.end;
        //滚动到底部，需要继续从数组后面取数据
        if (entry.isIntersecting && entry.target.id === "bottom") {
          const maxStartIndex = listLength - 1 - THRESHOLD;
          const maxEndIndex = listLength - 1;
          //此处10和5因为当前一共显示15条，可根据需要自行修改
          let newEnd = end + 10 <= maxEndIndex ? end + 10 : maxEndIndex;
          let newStart = end - 5 <= maxStartIndex ? end - 5 : maxStartIndex;
          this.updateState(newStart, newEnd);
        }
        //滚动到顶部，需要从数组前面取数据
        if (entry.isIntersecting && entry.target.id === "top") {
          let newEnd =
            end === THRESHOLD
              ? THRESHOLD
              : end - 10 > THRESHOLD
              ? end - 10
              : THRESHOLD;
          let newStart = start === 0 ? 0 : start - 10 > 0 ? start - 10 : 0;
          this.updateState(newStart, newEnd);
        }
      });
    },
    resetObservation() {
      //卸载监听事件，否则一直触发监听，直接加载到最后
      let top = document.querySelector("#top");
      let bottom = document.querySelector("#bottom");
      this.observer.unobserve(top);
      this.observer.unobserve(bottom);
    },
    updateState(newStart, newEnd) {
      if (this.start !== newStart || this.end !== newEnd) {
        this.resetObservation();
        let originStart = this.start,
          originEnd = this.end;
        this.start = newStart;
        this.end = newEnd;
        //更新完start和end后看是否有改变，有改变表示向下或者向上滚动，需要更新数组重新监听
        if (originStart != this.start || originEnd != this.end) {
          this.afterAll();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.infinite-scroll {
  width: 400px;
  height: 400px;
  overflow-y: auto;
  margin: 0 auto;
  border: 1px solid #eee;
}
.infinite-scroll-wraper {
  position: relative;
}
.infinite-scroll-item {
  display: flex;
  justify-content: center;
  list-style: none;
  box-shadow: 2px 2px 9px 0px #bbb;
  padding: 70px 0;
  margin-bottom: 20px;
  border-radius: 10px;
  position: absolute;
  width: 80%;
}
</style>