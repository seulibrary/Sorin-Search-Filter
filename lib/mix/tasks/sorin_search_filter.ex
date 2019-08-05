defmodule Mix.Tasks.SorinSearchFilter do
  use Mix.Task
  require Mix.Generator

  @shortdoc "Create and migrate necessary files for the Search Filter Plugin."
  def run(_args) do
    # Generate config file from sorin.exs file and move it to correct JS folder
    json_config = 
    Application.get_env(:sorin_search_filter, :filters)
    |> Jason.encode!
    
    # Where the config.json needs to live
    search_filter_path = "apps/frontend/assets/js/extensions/sorin_search_filter"

    File.write!(search_filter_path <> "/config.json", json_config)
    File.close(search_filter_path <> "/config.json")

    IO.puts "Search Filter Config Setup"
  end
end