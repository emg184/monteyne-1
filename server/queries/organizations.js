var catQueries = require("./categories")
var prodQueries = require("./products")

var knex = require("../knex.js");

function Organizations() {
  return knex("organizations");
}

function getAllOrganizations() {
  return Organizations().select();
}

function addOrganization(name, slug, status=true, image_url, primary, secondary, head='', foot='') {
  return Organizations().insert({
    organization_name: name,
    slug_id: slug,
    active: status,
    image: image_url,
    primary_color: primary,
    secondary_color: secondary,
    header: head,
    footer: foot
  });
}

function deleteOrganization(slug) {
  return Organizations()
    .where({ slug_id: slug })
      .del()
}

function deactivateOrganization(slug) {
  return Organizations()
    .where({ slug_id: slug })
      .update({ active: false })
}

function activateOrganization(slug) {
  return Organizations()
    .where({ slug_id: slug })
      .update({ active: true })
}

function updateOrganization(id, name, slug, status=true, image_url, primary, secondary, head, foot) {
  return Organizations().where({ organization_id: id })
    .update({
      organization_name: name,
      slug_id: slug,
      active: status,
      image: image_url,
      primary_color: primary,
      secondary_color: secondary,
      header: head,
      footer: foot
    })
}

function getOrganization(slug) {
  return Organizations()
    .where({ slug_id: slug });
}

function getOrganizationId(slug) {
  return Organizations()
    .where({ slug_id: slug })
}

function getAllOrganizationData(slug_id) {
  return getOrganizationId(slug_id)
          .then(function(org) {
            return catQueries.getOrganizationCategories(org[0].organization_id)
          })
            .then(function (result) {
              var catCollection = []
              result.map(function(res) {
                catCollection.push(res.category_id)
              })
              result.push(catCollection)
              return result
            })
              .then(function (catArray) {
                var orgPromise = getOrganization(slug_id)
                var dbPromise = prodQueries.whereInProducts(catArray[catArray.length -1])
                var arrPromise = catArray.slice(0, catArray.length - 1)
                return Promise.all([dbPromise, arrPromise, orgPromise]).then(function(values) {
                  return values
                })
              })
}

module.exports = {
  getAllOrganizations: getAllOrganizations,
  addOrganization: addOrganization,
  deleteOrganization: deleteOrganization,
  deactivateOrganization: deactivateOrganization,
  activateOrganization: activateOrganization,
  updateOrganization: updateOrganization,
  getOrganization: getOrganization,
  getOrganizationId: getOrganizationId,
  getAllOrganizationData: getAllOrganizationData
};
