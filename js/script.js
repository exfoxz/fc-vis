$( document ).ready(function() {
    // load data file
    var adv_method_names = {
        's.c.npz': 'FGSM on c net',
        'c.c.npz': 'C&W on c net',
    }

    $.ajax({
      url: "data/activations_slim.json",
      dataType: "json",
      success: function(response) {
        data = response;

        for(var key in data) {
            var btn = $('<button/>', {
                text: adv_method_names[key], // set text 1 to 10
                id: 'data_btn_' + key,
                value: key,
                click: function (evt) { 
                    // load data for this specific type and then list number of pics -> clickable to show the graph and pictures
                    console.log(evt);
                    var type = evt.target.value;

                    var tdata = data[type];

                    console.log(tdata);

                    // clear current #images div
                    var imagesSelectEl = $('#images-select')
                    imagesSelectEl.find('option')
                        .remove()
                        .end()



                    for(var i = 0; i < tdata.length; i++) {
                        imagesSelectEl
                            .append($("<option></option>")
                            .attr("value", i)
                            .text(i)); 
                    }

                    $("#images-select").on("change", function(event){
                        var selectedIndex = $(this).find("option:selected").val() - 1;
                        createNetworkGraphs(tdata[selectedIndex]);

                        // $('#image_adv').width(700); // Units are assumed to be pixels
                        // $('#image_adv').height(700);
                        $("#image_adv").attr('src', '/figures/' + key + '_adv_' + selectedIndex + '.png');
                        $("#image_benign").attr('src', '/figures/' + key + '_benign_' + selectedIndex + '.png');
                    });

                },
                class: "btn btn-primary btn-data"
            });

            $("#buttons").append(btn);
        }
      }
    });
});

function createNetworkGraphs(jsonGraph) {
    // create a network
    var modes = ['adv', 'benign'];
    for (var i in modes) {
        var key = modes[i];
        var container = document.getElementById('mynetwork_' + key);
    
        var data = jsonGraph[key];

        var options = {
            width: '1200',
            height: '300px',
            // edges option
            edges: {
                arrows: {
                    to: {enabled: true, type: 'arrow'}
                },
                scaling: {
                    label: {
                        enabled: true
                    },
                    min: -1,
                    max: 0.5 
                }
            },
            nodes: {
                scaling: {
                    label: {
                        enabled: true
                    }
                    
                }
            },
            // layout option
            layout: {
                randomSeed: 1994,
                // improvedLayout: true,
                hierarchical: {
                    enabled: true,
                    sortMethod: 'directed',
                    direction: 'UD'
                }
            }
        };

        var network = new vis.Network(container, data, options);
    }
}