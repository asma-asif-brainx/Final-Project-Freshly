$(document).ready(function () {
    $("#pageSteps").steps({
      headerTag: "li",
      bodyTag: "section",
      transitionEffect: "fade",
    });
    $("[data-step-target='plan-step']").on("click", function () {
      $("#pageSteps").steps("setStep", 1);
    });

  });
