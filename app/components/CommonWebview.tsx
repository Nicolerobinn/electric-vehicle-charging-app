import { WebView } from 'react-native-webview';

interface Props {
  source: string
}
function CommonWebview(props: Props) {
  const { source } = props
  return <WebView
    source={{ uri: source }}
    onMessage={({ nativeEvent }) => {
      console.log(nativeEvent.data)
      //拿到数据调用原生的代码即可
    }}
  />;
}
export default CommonWebview