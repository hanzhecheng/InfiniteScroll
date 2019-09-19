<template>
  <div class='home'>
    <InfiniteScroll :realList="list" :height="170"></InfiniteScroll>
  </div>
</template>

<script>
import InfiniteScroll from "@/components/InfiniteScroll.vue";
export default {
  name: "home",
  components: {
    InfiniteScroll
  },
  mounted() {
    for (let index = 0; index < 10000; index++) {
      this.list.push(index);
    }
  },
  data() {
    return {
      list: []
    };
  }
};
</script>
