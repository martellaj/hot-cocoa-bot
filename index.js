const { default: axios } = require("axios");

checkAvailability();

setInterval(() => {
  checkAvailability();
}, 10000);

function checkAvailability() {
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
        res.data.data.product.fulfillment
          .is_out_of_stock_in_all_store_locations;

      const isOutOfStockShipping =
        res.data.data.product.fulfillment.shipping_options
          .availability_status === "OUT_OF_STOCK";

      if (isOutOfStock && isOutOfStockShipping) {
        console.log(
          `[${new Date().toLocaleTimeString()}] Still out of stock...`
        );
      } else {
        axios.post(
          "https://discord.com/api/webhooks/911126327137021962/ADzfD7ab-aRprLNeUhQGaPDHS-rne0I4gxalrg5IiXc3MqgWMtKIrxvd57V0obRNpcEv",
          {
            content: `\`[${new Date().toLocaleTimeString()}]\` <@!514933935256371231> Go buy it! https://www.target.com/p/toy-coffee-38-cocoa-food-set-hearth-38-hand-8482-with-magnolia/-/A-82274909`,
          }
        );
        console.log(`[${new Date().toLocaleTimeString()}] WE'VE GOT A HIT`);
      }
    });
}
