import {
  shallowMount
} from "@vue/test-utils";
import InfiniteScroll from "@/components/InfiniteScroll.vue";

describe("InfiniteScroll.vue", () => {
  it("renders", () => {
    let realList = []
    for (let index = 0; index < 50; index++) {
      realList.push(index)
    }
    const wrapper = shallowMount(InfiniteScroll, {
      propsData: {
        realList
      }
    });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.virtualList.length).toBe(15);
      expect(wrapper.contains("#top")).toBe(true);
      expect(wrapper.contains("#bottom")).toBe(true);
      done()
    })
  });
 
});