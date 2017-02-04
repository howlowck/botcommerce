module.exports = function (bot) {
    bot.dialog('/viewCart', [
        function (session, args, next) {
            session.endDialog("VIEWCART DIALOG! YAY")
        }
    ])
}