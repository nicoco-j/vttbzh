$(function(){

  var dateNow = new Date(Date.now())

	var eventConstructor = (date, horaire, lieu, nomRando, departement, contact, description, lieuRdv, organisateur, prixClub, prixPublic) => {
	  var event = 
	  '<div class="row event">'+
	    '<div class="col-sm-12">'+
		  '<div class="row text-bold">'+
            '<div class="col-sm-2 spacer-sm-top">'+
              '<span class="d-block"><i class="far fa-calendar" aria-hidden="true"></i> ' + date +'</span>'+
            '</div>'+
            '<div class="col-sm-2 spacer-sm-top">'+
              '<span class="d-block"><i class="fa fa-map-marker-alt" aria-hidden="true"></i> ' + departement + ' - ' + lieu + '</span>'+
            '</div>'+
            '<div class="col-sm-7">'+
              '<p class="event-name text-primary spacer-sm-top text-uppercase">' + nomRando + '</p>'+
            '</div>'+
            '<div class="col-sm-1 read-more">'+
              '<i class="fas fa-chevron-circle-right"></i>'+
            '</div>'+
          '</div>'+
          '<div class="row hidde text-left">'+
            '<div class="col-sm-8 spacer-sm-top">'+
            '<span class="d-block"><p> Description</p></span>'+
              '<span class="d-block"><p> ' + description + '</p></span>'+
            '</div>'+
            '<div class="col-sm-4 spacer-sm-top">'+
              '<span class="d-block"><p> Horaires : ' + horaire + '</p></span>'+
              '<span class="d-block"><p> Département : ' + lieuRdv + '</p></span>'+
              '<span class="d-block"><p> Lieu de rendez-vous : ' + lieuRdv + '</p></span>'+
              '<span class="d-block"><p> Organisateur : ' + organisateur + '</p></span>'+
              '<span class="d-block"><p> Contact : ' + contact + '</p></span>'+
              '<span class="d-block"><p> Prix Club : ' + prixClub + '</p></span>'+
              '<span class="d-block"><p> Prix Public : ' + prixPublic + '</p></span>'+
            '</div>'+           
          '</div>'+
        '</div>'+
      '</div>'

      return event
	}

  var avisConstructor = (date, rate, comment, author, short)=>{
    var avisDetails = 
      '<div class="row">' +
        '<div class="col-12 bg-light spacer-sm-top">' +
          '<div class="spacer-md-top"></div>' +
          '<p>' + rate + ' - ' + short + '</p>'+
          '<p>' + ' ' + date + ' ' + author + '</p>'+
          '<p>' + comment + '</p>'+
        '</div>' +
      '</div>'

    return avisDetails
  }
  /*------
  NEWSLETTER
  ------*/

  $('#close').on('click', ()=>{
    $('#newsletter').remove()
  })
  
	/*------
	CALDENDAR
	------*/

  /*Event init*/
  if($('#calendar').length !== 0) {
    var gap = 20,
        nbProgrammeStart = 0,
        nbProgrammeEnd = nbProgrammeStart + gap,
        nbProgramme;

      var cta =
        '<div class="row bg-light premium">'+
          '<div class="col-12 text-center">'+
            '<p class="text-bold spacer-lg-top">Passez à VTT.bzh PREMIUM maintenant et recevez le programme de rando chaque semaine par email</p>'+
            '<a href="/premium.html" class="btn btn-secondary text-uppercase text-bold spacer-lg-bottom">Abonnez-vous à VTT.bzh Premium</a>'+
          '</div>'
        '</div>'

    var programme = (startNombre, endNombre)=>{
      $.getJSON( "https://jn-prod.github.io/node_scrapper/exports_files/details/vtt_details.json", ( data ) => {
        nbProgramme = data.length

        $('#nombre_rando').text(data.length + " randonnées")

        $('.premium').remove()

        //console.log(data[0])
        $.each( data, ( key, val ) => {
          if(key >= startNombre && key <= endNombre) {
            if(val.date.split('/')[2] !== undefined ){
              //console.log(key)
              var eventDateSplit = (val.date).split('/')
              var eventDate = new Date(eventDateSplit[2], eventDateSplit[1] - 1, eventDateSplit[0])

              /*Push only futur Date*/
              if( eventDate > dateNow ){
                $(eventConstructor(val.date, val.horaire, val.lieu, val.eventName, val.departement, val.contact, val.description, val.lieuRdv, val.organisateur, val.prixClub, val.prixPublic)).appendTo("#calendar-ajax")
              }        
            }          
          }
        });

        $('.event').each((i)=>{
          if ((i % 20) == 0) {
            console.log($('.event')[i])
            $(cta).insertBefore($('.event')[i])
          }          
        }) 

        $('#waiting').remove()
      })     
    }
 
    programme(nbProgrammeStart, nbProgrammeEnd)

    /*Event Details Trigger*/
    $(document).on('click', '.event', function (){
      var selector = $(this.children[0].children[0].children[3].children[0])
      var readMore = $(this.children[0].children[1])
      var event = $(this)
      var eventName = $($(this).find('.event-name'))

      selector.toggleClass('fa-chevron-circle-right')
      selector.toggleClass('fa-chevron-circle-down')
      readMore.toggleClass('hidde')
      event.toggleClass('bg-light')
      eventName.toggleClass('text-primary-active')
      eventName.toggleClass('text-primary')
    })

    /*Event Details load-more*/
    $(document).on('click', '#load-more', function (){
      nbProgrammeStart = nbProgrammeEnd + 1
      nbProgrammeEnd = nbProgrammeEnd + gap

      programme(nbProgrammeStart, nbProgrammeEnd)

      if(nbProgrammeEnd > nbProgramme){
        $('#load-more').remove()
      }
    })

  }

  

  /*------
  AVIS
  ------*/
  if($('#avis').length !== 0) {
    $.getJSON( "https://sheets.googleapis.com/v4/spreadsheets/1AMjV9P5haoZ5P3_Y9LtKSz4UxxBBejVVstBQCP-gymY/values/avis_old?key=AIzaSyCvAxjcQyPFS839MQpYLbZcykzQzeoogPA", ( data ) => {
      
      //console.log(data.values)

      $.each( data.values, ( key, val ) => {
        if(key !== 0){
          var avis =  {
            date : val[0],
            rate : val[1],
            comment : val[2],
            author : val[3],
            short : val[4]
          }

          $(avisConstructor(avis.date,avis.rate,avis.comment,avis.author,avis.short)).appendTo("#avis") 
        }      
      })
    })
  }
})
