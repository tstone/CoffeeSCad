define (require)->
  $ = require 'jquery'
  bootstrap = require 'bootstrap'
  marionette = require 'marionette'
  
  class ModalRegion extends Backbone.Marionette.Region
    el: "#none"

    constructor:(options) ->
      options = options or {}
      @large = options.large ? false
      elName = options.elName ? "dummyDiv"
      @makeEl(elName)
      options.el = "##{elName}"
      
      super options
      _.bindAll(this)
      
      @on("view:show", @showModal, @)
      
    makeEl:(elName)->
      if ($("#" + elName).length == 0)
        $ '<div/>',
          id: elName,
        .appendTo('body')
      
    getEl: (selector)->
      $el = $(selector)
      $el.on("hidden", @close)
      return $el
      
    showModal: (view)=>
      view.on("close", @hideModal, @)
      @$el.addClass('fade modal')
      #FIXME: weird bug: modal() does not add a modal class, but an "in" class to the div ??
      @$el.modal({'show':true,'backdrop':true})
      if @large
        @$el.addClass('modal-reallyBig')
        
    hideModal: ->
      @$el.modal 'hide'
      @$el.removeClass('fade')
      @$el.remove()
      @trigger("closed")
      
  return ModalRegion