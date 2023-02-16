import { WebView } from 'react-native-webview';

interface Props {
  source: string
}
function CommonWebview(props: Props) {
  const { source } = props
  return <WebView source={{ uri: source }} />;
}
export default CommonWebview