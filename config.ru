use Rack::Static, 
  :urls => ["/stylesheets", "/images", "/javascripts"],
  :root => "examples"

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('examples/org_chart.html', File::RDONLY)
  ]
}