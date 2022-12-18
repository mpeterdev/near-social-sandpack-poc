// demonstrates how to query the state without setting
// up an account. (View methods only)
const { providers } = require('near-api-js');
//network config (replace testnet with mainnet or betanet)
const provider = new providers.JsonRpcProvider('https://rpc.mainnet.near.org');

export default async function fetchWidgetCode(owner: string, name: string) {
  // const args_base64 = btoa('a')
  const args_base64 = Buffer.from(
    `{"keys":["${owner}/widget/${name}"]}`,
    'utf8'
  ).toString('base64');
  // console.log(args_base64);
  console.log('Fetching', owner, name);
  const rawResult = await provider.query({
    request_type: 'call_function',
    account_id: 'social.near',
    method_name: 'get',
    args_base64,
    finality: 'optimistic',
  });

  // format result
  const res = JSON.parse(Buffer.from(rawResult.result).toString());
  // console.log(res);

  let code = res?.[owner]?.widget?.[name];
  if (!code)
    return 'export default function Widget(){\nreturn <p>No widget found</p>\n}';

  if (!code.startsWith('export')) {
    // legacy near.social widget
    // TODO need more sophisticated legacy detection and also legacy APIs support
    // code = `export default function Widget(){\n${code}}`;
  }
  return code;
}
