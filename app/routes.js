import express from 'express'
import validator from 'express-validator'
import { exampleValidation } from './validations.js'
import { exampleWizardPaths, exampleWizardForks, trnWizardPaths, trnWizardForks} from './wizards.js'

const router = express.Router()

/**
 * Example route to demonstrate form validation.
 */
router.post('/examples/validation-errors', exampleValidation, (req, res) => {
  const errors = validator.validationResult(req)
  res.render('examples/validation-errors', {
    errors: errors.isEmpty() ? false : errors.mapped()
  })
})

/**
 * Example routes to demonstrate using wizard helper.
 */
router.get('/examples/wizard', (req, res) => {
  res.render('examples/wizard/index', {
    paths: exampleWizardPaths(req)
  })
})

router.get('/examples/wizard/:view', (req, res) => {
  res.render(`examples/wizard/${req.params.view}`, {
    paths: exampleWizardPaths(req)
  })
})

router.post('/examples/wizard/:view?', (req, res) => {
  const fork = exampleWizardForks(req)
  const paths = exampleWizardPaths(req)
  fork ? res.redirect(fork) : res.redirect(paths.next)
})


/**
 * TRN wizard routes
 */
router.get('/start', (req, res) => {
  res.render('start', {
    paths: trnWizardPaths(req)
  })
})

const userEmailMatchesDQTRecord = (data) => {
  return data['email-address'] === data['dqt_record']['email-address']
}

router.get('/name', (req, res, next) => {
  if (userEmailMatchesDQTRecord(req.session.data)) {
    res.redirect('/check-answers')
  } else {
    next()
  }
})

router.get('/:view', (req, res) => {
  res.render(req.params.view, {
    paths: trnWizardPaths(req)
  })
})

router.post('/:view?', (req, res) => {
  const fork = trnWizardForks(req)
  const paths = trnWizardPaths(req)
  fork ? res.redirect(fork) : res.redirect(paths.next)
})

export default router
