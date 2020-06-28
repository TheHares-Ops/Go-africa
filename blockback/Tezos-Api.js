const bcoin = require('bcoin').set('main');
const WalletDB = bcoin.WalletDB;
const WalletKey = bcoin.wallet.WalletKey;
const KeyRing = bcoin.keyring;
const Mnemonic = bcoin.hd.Mnemonic;
const HD = bcoin.hd;
const {WalletClient} = require('bclient');
const {Network} = require('bcoin');
const util = require('util');
//const network = Network.get('main');
const network = Network.get('main');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const port = 3000;
const fs = require('fs')
var express = require('express');
var app = express();
var conseiljs = require('conseiljs')
const conseilServer = { url: 'https://conseil-prod.cryptonomic-infra.tech', apiKey: 'galleon' };
const tezosNode = 'https://tezos-prod.cryptonomic-infra.tech';
const conseilNode = 
{
    url: 'https://tezos-prod.cryptonomic-infra.tech',
    apiKey: 'd365e943-7bc1-4212-b5d4-2e8d8c19f163'};


const platform = 'tezos';
const xtznetwork = 'mainnet';
const entity = 'operations';

const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
 
var options23 = {
  explorer: true,
  swaggerOptions: {
    url: 'http://petstore.swagger.io/v2/swagger.json'
  }
}
  function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

app.get('/CreateXTZWallet', function(req,res)
{
        createWallet().catch(console.error.bind(console));
        async function createWallet()
        {        
        const mnemonic = conseiljs.TezosWalletUtil.generateMnemonic();
         //console.log(`mnemonic: ${mnemonic}`);
        const keystore = await conseiljs.TezosWalletUtil.unlockIdentityWithMnemonic(mnemonic, 'Vykuj3546');
        var ret =
        [
           count =
            {
            'seed': mnemonic,
            'publickey': keystore.publicKey,
            'privatekey':keystore.privateKey,
            'publickeyhash':keystore.publicKeyHash,
            },
        ];
        ret = JSON.stringify(ret);
        res.json(ret)
        };
})

app.get('/xtzgetBalance', function (req, res) {

        //var pbk = req.param('publickey');
        //var prk = req.param('privatekey');
        var pkh = req.param('publickeyhash');

        const keystore = {
            publicKey: '',
            privateKey: '',
            publicKeyHash: pkh,
            seed: '',
            storeType: 'conseiljs.StoreType.Fundraiser'
        };
        accountBalance().catch(console.error.bind(console));
        async function accountBalance() 
        {
        console.log(keystore.publicKey);
            let accountQuery = conseiljs.ConseilQueryBuilder.blankQuery();
            accountQuery = conseiljs.ConseilQueryBuilder.addFields(accountQuery, 'account_id', 'balance');
            accountQuery = conseiljs.ConseilQueryBuilder.addPredicate(accountQuery, 'account_id', conseiljs.ConseilOperator.EQ, [keystore.publicKeyHash]);
            accountQuery = conseiljs.ConseilQueryBuilder.setLimit(accountQuery, 1);
            const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', 'mainnet', 'accounts', accountQuery);
            console.log(result);
            res.json(result);
            //console.log(`${util.inspect(result, false, 2, false)}`);
        }

        })
    
app.get('/xtzgettxlist', function (req, res) 
    {
        //var pbk = req.param('publickey');
        //var prk = req.param('privatekey');
        var pkh = req.param('publickeyhash');

        const keystore = {
            publicKey: '',
            privateKey: '',
            publicKeyHash: pkh,
            seed: '',
            storeType: 'conseiljs.StoreType.Fundraiser',
            email: 'yoyhmapi.ugewcsiv@tezos.example.org',
            amount: '5652123072' 
        };


        listAccountTransactions().catch(console.error.bind(console));
        async function listAccountTransactions() {
            let sendQuery = conseiljs.ConseilQueryBuilder.blankQuery();
            sendQuery = conseiljs.ConseilQueryBuilder.addFields(sendQuery, 'block_level', 'timestamp', 'source', 'destination', 'amount', 'fee', 'counter');
            sendQuery = conseiljs.ConseilQueryBuilder.addPredicate(sendQuery, 'kind', conseiljs.ConseilOperator.EQ, ['transaction'], false);
            sendQuery = conseiljs.ConseilQueryBuilder.addPredicate(sendQuery, 'source', conseiljs.ConseilOperator.EQ, [keystore.publicKeyHash], false);
            sendQuery = conseiljs.ConseilQueryBuilder.addPredicate(sendQuery, 'status', conseiljs.ConseilOperator.EQ, ['applied'], false);
            sendQuery = conseiljs.ConseilQueryBuilder.addOrdering(sendQuery, 'block_level', conseiljs.ConseilSortDirection.DESC);
            sendQuery = conseiljs.ConseilQueryBuilder.addOrdering(sendQuery, 'block_level', conseiljs.ConseilSortDirection.ASC);
            sendQuery = conseiljs.ConseilQueryBuilder.setLimit(sendQuery, 100);
        
            let receiveQuery = conseiljs.ConseilQueryBuilder.blankQuery();
            receiveQuery = conseiljs.ConseilQueryBuilder.addFields(receiveQuery, 'block_level', 'timestamp', 'source', 'destination', 'amount', 'fee', 'counter');
            receiveQuery = conseiljs.ConseilQueryBuilder.addPredicate(receiveQuery, 'kind', conseiljs.ConseilOperator.EQ, ['transaction'], false);
            receiveQuery = conseiljs.ConseilQueryBuilder.addPredicate(receiveQuery, 'destination', conseiljs.ConseilOperator.EQ, [keystore.publicKeyHash], false);
            receiveQuery = conseiljs.ConseilQueryBuilder.addPredicate(receiveQuery, 'status', conseiljs.ConseilOperator.EQ, ['applied'], false);
            receiveQuery = conseiljs.ConseilQueryBuilder.addOrdering(receiveQuery, 'block_level', conseiljs.ConseilSortDirection.DESC);
            receiveQuery = conseiljs.ConseilQueryBuilder.setLimit(receiveQuery, 100);
       conseiljs.tezos
            const sendResult = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, platform, xtznetwork, entity, sendQuery);
            const receiveResult = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, platform, xtznetwork, entity, receiveQuery);
            const transactions = sendResult.concat(receiveResult).sort((a, b) => { return a['timestamp'] - b['timestamp'] });
		
			//console.log(`${util.inspect(transactions, false, 2, false)}`);
            //res.json(transactions);
			
			var temp = transactions.reverse();
			console.log(`${util.inspect(temp, false, 2, false)}`);
            res.json(temp);
        }
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/xtzsendtx', function (req, res) 
{		
    var post=req.body;
    //var pbk = req.param('publickey');
    //var prk = req.param('privatekey');
    //var pkh = req.param('publickeyhash');
    //var amount = req.param('amount');
    //var receiver = req.param('receiver');

    var pbk = post.publickey;
    var prk = post.privatekey;
    var pkh = post.publickeyhash;
    var amount = post.amount;
    var receiver = post.receiver;
    var fees = post.fees ;
    

    //console.log('publickey : ' + pbk);
    //console.log('privatekey : ' + prk);
    //console.log('publickeyhash : ' + pkh);
    //console.log('amount : ' + amount);
    //console.log('receiver : ' + receiver);
    const keystore = {
        publicKey: pbk,
        privateKey: prk,
        publicKeyHash: pkh,
        seed: '',
        storeType: 'conseiljs.StoreType.Fundraiser',
    };
    
    if(keystore.privateKey==null){

        res.json({error : 'private null'});
    }else{

        console.log(keystore)

        sendxtz().catch(console.error.bind(console));
    }


    async function sendxtz()
 {
            const result = await conseiljs.TezosNodeWriter.sendTransactionOperation(tezosNode, keystore, receiver, amount, 50000, '');
            console.log(`Injected operation group id ${result.operationGroupID}`);
            res.json(`Injected operation group id ${result.operationGroupID}`);
        } 
    })

app.post('/xtzsendtxuser', function (req, res){
        var post=req.body;

    
        var pbk = req.param('publickey');
        var prk = req.param('privatekey');
        var pkh = req.param('publickeyhash');
        var amount = req.param('amount');
        var receiveraddress = req.param('receiver');
        var address = "2";
        
        const keystore = {
                publicKey: pbk,
                privateKey: prk,
                publicKeyHash: pkh,
                seed: '',
                storeType: 'conseiljs.StoreType.Fundraiser',
            };

            if(keystore.privateKey==null){

                res.json({error : 'private null'});
            }else {

                console.log(keystore);
                connection.query(' SELECT `wallet`.`public_key_hash` FROM `wallet` INNER JOIN customers ON wallet.customer_id = customers.customers_id  WHERE customers.login =\'' + receiveraddress + '\'', (err,rows/*,fields*/) => 
                {
                if(err){
                console.log(err.message);
                return ;
                }
                else if (rows.length == 0)
                {
                res.json("bad Username");
                }
                else 
                {
                address = rows[0].public_key_hash;
        
                sendxtz().catch(console.error.bind(console));
                async function sendxtz()
                {
                        const result = await conseiljs.TezosNodeWriter.sendTransactionOperation(tezosNode, keystore, address, amount, 50000, '');
                        console.log(`Injected operation group id ${result.operationGroupID}`);
                        res.json(`Injected operation group id ${result.operationGroupID}`);
                } 
        
                }       
        
                })

            }

        
        })

        app.post('/xtzgetkeys', function (req, res) 
        {
                var mnemo = req.body.mnemonic;
                var user = req.body.user;

                xtzgetkeys().catch(console.error.bind(console));
                async function xtzgetkeys()
                {
                        const keystore = await conseiljs.TezosWalletUtil.getKeysFromMnemonicAndPassphrase(mnemo, '');
                        var ret =
                        [
                           count =
                            {
                            'seed': mnemo,
                            'publickey': keystore.publicKey,
                            'privatekey':keystore.privateKey,
                            'publickeyhash':keystore.publicKeyHash,
                            },
                        ];
                        ret = JSON.stringify(ret);
                        res.json(ret);
                }
        })

app.post('/recouvrytezos', function (req, res){
               
        var so ="inquiry sudden era winner arrange climb welcome note credit process source gorilla joke juice enter nice network awkward woman auto shaft want denial spike"
            console.log('je suis dans la fonction recouvry')
           var seed = req.body.seed ; 
recouvry().catch(console.error.bind(console));
             async function recouvry()
        {
                console.log('je suis dans la fonction asyn')
             //  const result = await conseiljs.util.generateKeys(seed);
            // result = await CryptoUtils.generateKeys(seed)
           //  result =  await   conseiljs.TezosWalletUt;
           //  utils.CryptoUtils.generateKeys(seed)
         //    result = await conseiljs.TezosWalletUtil.generateKeys(seed);
       //    result = await conseiljs.util.generateKeys(seed);
                console.log(`le resultat ${result}`);
                res.send(result);   
               // conseiljs.util.generateKeys(seed);
        } 

try {
        
        
} catch (error) {

        console.log('je suis dans le catch')
        
}
               
               
              
                
               
                console.log('terminÃ© ');
                
                
                })


                app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options23));

//-------------------Server Listening --------------------------------
//app.listen(3000)
app.listen(port, (err) => {
  if (err) {
    return console.log('An Error Occured.', err)
  }

  console.log(`server is listening on ${port}`)
})
