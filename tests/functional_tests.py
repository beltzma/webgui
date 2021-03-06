from selenium import webdriver
import unittest

class NewVisitorTest(unittest.TestCase):

    def setUp(self):
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(3)

    def tearDown(self):
        self.browser.quit()

    def test_can_start_a_list_and_retireve_it_later(self):
        self.browser.get('http://localhost')
        self.assertIn('settings_first.png', self.browser.title)
        self.fail('Finish the Test')

if __name__ == '__main__':
    unittest.main(warnings='ignore')


