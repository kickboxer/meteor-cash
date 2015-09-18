Template.transactionsInfo.helpers({
    allMoney: function () {
        var accounts = Accounts.find().fetch();
        var exRates = Exrates.find().fetch();

        return accounting.formatNumber(_.reduce(_.map(Transactions.find().fetch(), function (doc) {
            var currency = _.result(_.findWhere(accounts, {'_id' : doc.account}), 'currencyId');
            var rateUSD = _.result(_.findWhere(exRates, {'Cur_Abbreviation' : 'USD'}), 'Cur_OfficialRate');
            if (currency === 'USD') {
                return doc.amount;
            } else if (currency === 'BYR') {
                return Number((doc.amount / rateUSD).toFixed(2));
            } else {
                var rate = _.result(_.findWhere(exRates, {'Cur_Abbreviation' : currency}), 'Cur_OfficialRate');
                return Number(((doc.amount * rate) / rateUSD).toFixed(2));
            }
        }), function (memo, num) {
            return memo + num;
        }), 2);
    },
    currency: function () {
        return '$';
    },
    accountsList: function () {
        var accounts = Accounts.find().fetch();

        return _.map(accounts, function(doc) {
            return _.assign(doc, {
                balance: accounting.formatNumber(_.reduce(_.map(Transactions.find({account: doc._id}).fetch(), function (subdoc) {
                    return subdoc.amount;
                }), function (memo, num) {
                    return memo + num;
                }), 2) || '0'
            })
        });
    }
});