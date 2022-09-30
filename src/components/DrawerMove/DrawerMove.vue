<template>
  <teleport to="body">
    <el-drawer
      v-model="visible"
      v-bind="initAttrs()"
      :custom-class="customClass"
      :size="drawerWidth"
    >
      <div class="draw-bar" @mousedown="barMove">
        <div>
          .
          .
          .
        </div>
      </div>
      <el-button class="fix-drawer-focus"></el-button>
      <div
        v-loading="loading"
        :element-loading-text="loadingText"
        class="drawer-wrapper"
      >
        <div v-if="$slots.header" class="drawer-header">
          <slot name="header"></slot>
        </div>
        <div v-if="$slots.default" class="drawer-body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="drawer-footer">
          <slot name="footer"></slot>
        </div>
      </div>
      <span ref="focus"></span>
    </el-drawer>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from "vue";
import { ElMessage } from 'element-plus';

const propsType = {
  size: {
    type: Number as PropType<number>,
    default: 600,
  },
  // 缓存移动宽度
  cache: {
    type: String as PropType<string>,
    default: "UNIVERSAL",
  },
  minSize: {
    type: Number as PropType<number>,
    default: 400,
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  loadingText: {
    type: String as PropType<string>,
    default: '正在加载中。。。',
  }
};

export default defineComponent({
  name: 'drawer-move',
  props: propsType,
  setup(props, context) {
    const customClassArr = ['bbui-drawer']
    const customClass = context.attrs['custom-class'] || context.attrs['customClass']
    if (customClass) {
      customClassArr.push(customClass as string)
    }
    const visible = ref(false);
    const drawerWidth = ref(props.size);
    // 更改默认值
    const initAttrs = () => {
      const attrs = {
        // 默认不显示 头部和关闭icon（不显示头部不显示titile）
        "show-close": false,
        "with-header": false,
        ...context.attrs,
      };
      return attrs;
    };
    // 获取当前宽度
    const getCurrentWidth = () => {
      return drawerWidth.value;
    };
    // 计算移动
    const barMove = () => {
      const windowWidth = window.innerWidth;
      const bodyId: HTMLElement = document.querySelector('body')!;
      bodyId.onmousemove = (v: MouseEvent) => {
        bodyId.style.cursor = 'col-resize';
        v.preventDefault();
        const moveX = v.clientX;
        if (
          windowWidth - moveX < props.minSize ||
          windowWidth - moveX > windowWidth - 200
        ) {
          return;
        }
        drawerWidth.value = windowWidth - moveX;
      };
      bodyId.onmouseup = () => {
        bodyId.style.cursor = 'default';
        bodyId.onmousemove = null;
      };
      bodyId.onmouseleave = () => {
        bodyId.style.cursor = 'default';
        bodyId.onmousemove = null;
      };
    };

    const storageWidth = ref();
    // 获取宽度缓存
    const getCache = () => {
      if (!props.cache) return;
      const windowWidth = window.innerWidth;
      const drawerCache = window.localStorage.getItem("DRAWER_CACHE");
      const getDrawerCache = drawerCache
        ? JSON.parse(drawerCache)[props.cache]
        : {};
      if (getDrawerCache?.size) {
        const width =
          getDrawerCache.size > windowWidth - 200
            ? windowWidth - 200
            : getDrawerCache.size;
        drawerWidth.value = width;
        storageWidth.value = width;
      }
    };
    // 设置缓存
    const setCache = () => {
      if (drawerWidth.value === storageWidth.value) return;
      const drawerCache = window.localStorage.getItem("DRAWER_CACHE");
      const getDrawerCache = drawerCache ? JSON.parse(drawerCache) : {};
      const newCache = {
        ...getDrawerCache,
        [props.cache as string]: {
          size: drawerWidth.value,
        },
      };
      window.localStorage.setItem("DRAWER_CACHE", JSON.stringify(newCache));
    };

    const open = () => {
      getCache();
      visible.value = true;
      ElMessage.success('打开成功')
    };
    const close = () => {
      setCache();
      visible.value = false;
    };

    onMounted(() => {
      // 关闭浏览器
      window.addEventListener("beforeunload", () => {
        setCache();
      });
    });

    return {
      customClass: customClassArr.join(' '),
      // arg
      visible,
      drawerWidth,
      // fn
      initAttrs,
      getCurrentWidth,
      open,
      close,
      barMove,
      getCache,
      setCache,
      // isCloseConfirm,
    };
  },
});
</script>

<!-- <style lang="scss" scoped>
.fix-drawer-focus {
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  margin: 0;
  border: none;
  opacity: 0;
}
.draw-bar {
  position: absolute;
  left: 0;
  top: 0;
  width: 5px;
  height: 100vh;
  z-index: 1500;
  -webkit-transition-property: background-color;
  -webkit-transition-duration: 0.5s;
  -webkit-transition-timing-function: ease;
  display: flex;
  align-items: center;
  div {
    color: white;
    line-height: 10px;
  }
}
.draw-bar:hover {
  cursor: col-resize;
  background: #1890ff;
}
.draw-bar {
  background: #d4d4d4;
}
.drawer-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  .drawer-header {
    box-sizing: border-box;
    width: 100%;
    min-height: 65px;
    display: flex;
    padding: 15px 20px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dcdfe6;
    font-size: 18px;
    font-weight: 500;
  }
  .drawer-body {
    width: 100%;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
  }
  .drawer-footer {
    width: 100%;
    height: auto;
    display: flex;
    padding: 15px 20px;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #dcdfe6;
  }
}
</style> -->
