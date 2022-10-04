import { computed } from 'vue';
import { pick } from 'lodash-es'; // !从一个对象pick出只含picks数组属性的对象

// 抽离公共方法
const useComponentCommon = <T extends { [key: string]: any }>(props: T, picks: string[]) => {
  const styleProps = computed(() => pick(props, picks));
  const handleClick = () => {
    if (props.actionType === 'url' && props.url && !props.isEditing) {
      window.location.href = props.url;
    }
  };

  return {
    styleProps,
    handleClick
  };
};

export default useComponentCommon;
