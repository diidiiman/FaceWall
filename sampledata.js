picZoomerData = [];

for (i = 1; i<=50; i++)
{
    var arr = [makeName(), 'pic/'+i+'.jpg', random_amount(), generate_quote()]
    picZoomerData.push(arr)
}

function makeName()
{
    var random_words = 'Cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus Maecenas faucibus mollis interdum Nulla vitae elit libero a pharetra augue Fusce dapibus tellus ac cursus commodo tortor mauris condimentum nibh ut fermentum massa justo sit amet risus Aenean lacinia bibendum nulla sed consectetur Aenean lacinia bibendum nulla sed consectetur Curabitur blandit tempus porttitor Vestibulum id ligula porta felis euismod semper Etiam porta sem malesuada magna mollis euismod Integer posuere erat a ante venenatis dapibus posuere velit aliquet Nullam id dolor id nibh ultricies vehicula ut id elit Curabitur blandit tempus porttitor Vestibulum id ligula porta felis euismod semper Integer posuere erat a ante venenatis dapibus posuere velit aliquet Morbi leo risus porta ac consectetur ac vestibulum at eros Cras mattis consectetur purus sit amet fermentum ';

    random_words = random_words.replace('.', ' ');
    random_words = random_words.replace(',', ' ');
    random = random_words.split(' ')
    oneWord = capitaliseFirstLetter(random[Math.floor(Math.random()*random.length)])
    secWord = capitaliseFirstLetter(random[Math.floor(Math.random()*random.length)])
    return oneWord + ' ' + secWord;
}

function generate_quote()
{
    var random_words = 'Cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus Maecenas faucibus mollis interdum Nulla vitae elit libero a pharetra augue Fusce dapibus tellus ac cursus commodo tortor mauris condimentum nibh ut fermentum massa justo sit amet risus Aenean lacinia bibendum nulla sed consectetur Aenean lacinia bibendum nulla sed consectetur Curabitur blandit tempus porttitor Vestibulum id ligula porta felis euismod semper Etiam porta sem malesuada magna mollis euismod Integer posuere erat a ante venenatis dapibus posuere velit aliquet Nullam id dolor id nibh ultricies vehicula ut id elit Curabitur blandit tempus porttitor Vestibulum id ligula porta felis euismod semper Integer posuere erat a ante venenatis dapibus posuere velit aliquet Morbi leo risus porta ac consectetur ac vestibulum at eros Cras mattis consectetur purus sit amet fermentum ';

    sentence = [];
    random_words = random_words.replace('.', ' ');
    random_words = random_words.replace(',', ' ');
    random = random_words.split(' ')
    oneWord = capitaliseFirstLetter(random[Math.floor(Math.random()*random.length)])
    for (j = 0; j < 10; j++)
    {
        sentence.push(random[Math.floor(Math.random()*random.length)])
    }
    sentence = sentence.join(' ');

    return '"'+oneWord + ' ' + sentence + '."';
}


function random_amount()
{
    return Math.ceil(Math.random() * 50 + 1960);
}


function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

colours = [ [43,36,36], [226,113,143], [157,211,215], [138,40,84], [224,124,56], [255,255,255] ];