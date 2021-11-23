const { default: axios } = require("axios");

let addedToCart = false;

checkAvailability(true);

const loop = setInterval(() => {
  checkAvailability();
}, 1000);

function checkAvailability(tryBuy = false) {
  axios
    .get(
      "https://redsky.target.com/redsky_aggregations/v1/web/pdp_fulfillment_v1?key=ff457966e64d5e877fdbad070f276d18ecec4a01&tcin=82274909&store_id=1118&store_positions_store_id=1118&has_store_positions_store_id=true&zip=98034&state=WA&latitude=47.727959&longitude=-122.192733&scheduled_delivery_store_id=1118&pricing_store_id=1118&has_pricing_store_id=true&is_bot=false"
    )
    .then((res) => {
      console.log(res?.status);
      console.log(res?.data);

      // check for stale token
      if (res?.data?.errors) {
        axios.post(
          "https://discord.com/api/webhooks/911126327137021962/ADzfD7ab-aRprLNeUhQGaPDHS-rne0I4gxalrg5IiXc3MqgWMtKIrxvd57V0obRNpcEv",
          {
            content: `\`[${new Date().toLocaleTimeString()}]\` <@!514933935256371231> ${
              res.data.errors[0].reason
            }`,
          }
        );
        console.log(
          `[${new Date().toLocaleTimeString()}] ${res.data.errors[0].reason}`
        );
      }

      const isOutOfStock =
        res.data.data?.product?.fulfillment
          ?.is_out_of_stock_in_all_store_locations;

      const isOutOfStockShipping =
        res.data.data?.product?.fulfillment?.shipping_options
          ?.availability_status === "OUT_OF_STOCK";

      if (isOutOfStock && isOutOfStockShipping && !tryBuy) {
        console.log(
          `[${new Date().toLocaleTimeString()}] Still out of stock...`
        );
      } else {
        if (addedToCart) {
          return;
        }

        if (!tryBuy) {
          addedToCart = true;
        }

        axios
          .post(
            "https://carts.target.com/web_checkouts/v1/cart_items?field_groups=CART%2CCART_ITEMS%2CSUMMARY%2CFINANCE_PROVIDERS&key=feaf228eb2777fd3eee0fd5192ae7107d6224b39",
            {
              cart_item: {
                tcin: "82274909",
                quantity: 1,
                item_channel_id: "10",
              },
              cart_type: "REGULAR",
              channel_id: "90",
              shopping_context: "DIGITAL",
            },
            {
              headers: {
                cookie: `TealeafAkaSid=AS5iDg8L64ahT_qr1mRuY2irGD70H4bj; visitorId=017D3679EFD6020193E8CA9A8BA6B22A; sapphire=1; adaptiveSessionId=A9689222357; criteo={}; tlThirdPartyIds={"pt":"v2:1dd6bc68ffbba823816edffd237f4ebb9f16b363ec3df03fddbec4bae037f12b|ffa937a624e397e326e5b9a19a5b5ceea44d6aa5ea9e94303deb6f145c4c9ca2"}; ci_pixmgr=other; login-session=LVHiYexMeMfPDmmnYIQARZt13ZLxnrS2cqpK3Tjc_Mu82DAyr5wYkuFqSgjQh2xD; mystate=1637303665711; 3YCzT93n=AzRm5zZ9AQAAuSXCRU_HoXnu1sst5g-Dm0FScIMJ9vHiolcJQ54m8QtFXYOQAUnvARWucgqrwH8AAOfvAAAAAA|1|1|0fd1008d169854dad125ba7d091c1da79537bb1f; mid=8087390170; hasApp=false; egsSessionId=749de922-bbad-47ad-9ef0-a65833cd9f96; accessToken=eyJraWQiOiJlYXMyIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI4MDg3MzkwMTcwIiwiaXNzIjoiTUk2IiwiZXhwIjoxNjM3NjU4NTkzLCJpYXQiOjE2Mzc2NDQxOTMsImp0aSI6IlRHVC5kZDUzM2RlNTZlZDM0NmU4OWIyZTU0OWMxNmJjNjhjYS1tIiwic2t5IjoiZWFzMiIsInN1dCI6IlIiLCJkaWQiOiJkYzQzZjlmMTFiNTJkZmQ3ZmViNjQ5NjFhOTRhYTQ3ZTQ2MjhmYjQwMzc5OTM3MTM2NDY0MjIwMGY3ODFhNzA5IiwiZWlkIjoibWFydGVsbGFqQGxpdmUuY29tIiwiZ3NzIjoxLjAsInNjbyI6ImVjb20ubWVkLG9wZW5pZCIsImNsaSI6ImVjb20td2ViLTEuMC4wIiwiYXNsIjoiTSJ9.LNqZsTfDYtPa8KA_ZbA_bdmABr53KZzxGIZZ-og5yLyyelKFnQGpEiVL4zyl5ghopjq6SjHm08QRZcTSMZnuUcLn2xzRc6saQSmvePaJXr0ZeDuCwtkOP5NanJ7FDisIJXr-Xewc1isadTSupMQA0c9990bR-GDDPA8ZXF_9hnzFZjCBgZsOJWbxCulSFsNUNObQKDWXJdPI_qqXl59Alv8B6QjyeqEMkuh9uE27WRZIJLbRVWoJpYNN8wO0S7ggpzcfkmmqobzkWCwHdpBq8LSh9cX8GGFvFvNIfcZnakq_d_5SPXYm2KEQtkKySbfTByojVuVYDimLiTxKg52KnQ; idToken=eyJhbGciOiJub25lIn0.eyJzdWIiOiI4MDg3MzkwMTcwIiwiaXNzIjoiTUk2IiwiZXhwIjoxNjM3NjU4NTkzLCJpYXQiOjE2Mzc2NDQxOTMsImFzcyI6Ik0iLCJzdXQiOiJSIiwiY2xpIjoiZWNvbS13ZWItMS4wLjAiLCJwcm8iOnsiZm4iOiJKb2UiLCJlbSI6Im1hcnRlbGxhakBsaXZlLmNvbSIsInBoIjp0cnVlLCJsZWQiOm51bGwsImx0eSI6dHJ1ZX19.; refreshToken=TGT.dd533de56ed346e89b2e549c16bc68ca-m; guestType=R|1637644193000; UserLocation=98034|47.727959|-122.192733|WA|US; fiatsCookie=DSI_1118|DSN_Woodinville|DSZ_98072-3523; _mitata=ZDUwZmNhMjUzYzdmYTIzNTI3MmMyMTBiNjEwZWY4NjlmZWQxMjBhODU3NDhiZDVlOGY1NTAxZWJiZWIyOGMwNw==_/@#/1637646245_/@#/cqmWmTJHXATxOlIX_/@#/ZjQwOTU3OWYyYTUxMzVmNjFjNmVkYWJhMjE5YTVhNjIwNzY1OTkwZTdiNmMyZDkwZmIxYTM4MTRhN2ExNTNiOQ==_/@#/000; ffsession={"sessionHash":"11265e872f07361637296503509","sessionHit":650,"prevPageName":"toys: product detail","prevPageUrl":"https://www.target.com/p/toy-kitchen-mixer-green-hearth-38-hand-8482-with-magnolia/-/A-82274902","prevSearchTerm":"non-search","prevPageType":"product details"}; targetMobileCookie=hasRC:false~loyaltyId:tly.231712974e534c1f9ba4f7d506562786~cartQty:1~guestLogonId:martellaj@live.com~guestDisplayName:Joe~guestHasVerifiedPhone:true`,
              },
            }
          )
          .then((response) => {
            console.log("------------------");
            console.log("------------------");
            console.log(response.data);
          })
          .catch((error) => {
            console.log("**********************");
            console.log(error.response.data);
            console.log(error.response.data.alerts[0].metadata);
          });

        axios.post(
          "https://discord.com/api/webhooks/911126327137021962/ADzfD7ab-aRprLNeUhQGaPDHS-rne0I4gxalrg5IiXc3MqgWMtKIrxvd57V0obRNpcEv",
          {
            content: `\`[${new Date().toLocaleTimeString()}]\` <@!514933935256371231> Go buy it! https://www.target.com/p/toy-coffee-38-cocoa-food-set-hearth-38-hand-8482-with-magnolia/-/A-82274909`,
          }
        );
        console.log(`[${new Date().toLocaleTimeString()}] WE'VE GOT A HIT`);

        if (!tryBuy) {
          clearInterval(loop);
        }
      }
    });
}
