Meteor.methods({
    exportAllTransactionsToCsv: function() {
        var fields = [
            "Id",
            "Type",
            "Date",
            "Amount",
            "Categories",
            "Account",
            "AmountTo",
            "AccountTo",
            "Tags",
            "Notes"
        ];

        var data = [];

        var transactions = Transactions.find().fetch();
        _.each(transactions, function(t) {
            data.push([
                t._id,
                getTypeName(t.type),
                moment.utc(t.date).format("DD/MM/YYYY"),
                t.amount,
                _.result(_.find(Categories.find().fetch(), {'_id' : t.categories}), 'title') || '',
                _.result(_.find(Accounts.find().fetch(), {'_id' : t.account}), 'name'),
                t.amountTo || '',
                _.result(_.find(Accounts.find().fetch(), {'_id' : t.accountTo}), 'name') || '',
                getTagNames(t.tags),
                t.notes || ''
            ]);
        });

        return {fields: fields, data: data};
    },
    exportAllTransactionsToJson: function() {
        var data = [];

        var transactions = Transactions.find().fetch();
        _.each(transactions, function(t) {
            data.push({
                "Id": t._id,
                "Type": getTypeName(t.type),
                "Date": moment.utc(t.date).format("DD/MM/YYYY"),
                "Amount": t.amount,
                "Categories": _.result(_.find(Categories.find().fetch(), {'_id': t.categories}), 'title') || '',
                "Account": _.result(_.find(Accounts.find().fetch(), {'_id': t.account}), 'name'),
                "AmountTo": t.amountTo || '',
                "AccountTo": _.result(_.find(Accounts.find().fetch(), {'_id': t.accountTo}), 'name') || '',
                "Tags": getTagNames(t.tags),
                "Notes": t.notes || ''
            });
        });

        return {data: data};
    }
});

function getTypeName(typeId) {
    if (typeId == 2) {
        return 'Expense'
    } else if (typeId == 1) {
        return 'Income'
    } else {
        return 'Transfer'
    }
}
function getTagNames(tags) {
    var tagNames = [];
    _.forEach(tags, function(tag) {
        tagNames.push(_.result(_.find(Tags.find().fetch(), {'_id' : tag}), 'title'));
    });
    return tagNames;
}