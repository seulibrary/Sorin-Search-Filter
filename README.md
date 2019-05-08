# SorinSearchFilter

Sorin Search Filter is a [Sorin](https://github.com/seulibrary/Sorin) extension that provides an extensible, customizable framework for building a front end panel for search filters, populating it with specified filters, and supplying the filters to the active search catalog extension, which must then be edited to add in filter parsing functions.

## Installation

1. Add the following to Sorin's root-level `mix.exs`:

```elixir
def deps do
  [
    ...,
    {:sorin_search_filter, path: "https://github.com/seulibrary/Sorin-Search-Filter"},
  ]
end
```

2. From the root of the application:

```sh
$ mix deps.get && mix deps.compile
```

3. Add the necessary configuration stanza to `sorin.exs`, [as outlined below](#the-configuration-stanza)

4. From the root of the application:

```sh
$ mix setup_extension SorinSearchFilter
```

`setup_extension` is a mix task that runs `npm`, migrates the necessary JavaScript into the frontend application, and compiles `config.json` from `sorin.exs`.

**You are now ready to roll.** :red_car:

## The configuration stanza

All of SorinSearchFilter's configuration lives in Sorin's main configuration file, sorin.exs. To begin to populate it, add this stanza:

```elixir
config :sorin_search_filter,
  filters: [
  
  ]
```

The square brackets indicate that the _filters_ key takes a list as its value; in this case a list of filters you want to use, with each filter encoded as an Elixir _map_: `%{key: value}`.

```elixir
config :sorin_search_filter,
  filters: [
    %{label: "Search By:",
      variable: "search_by",
      format: "radio",
      group: "queryField",
      entries: [
        %{label: "Any",
          variable: "any"},
        %{label: "Creator",
          variable: "creator"},
        %{label: "Subject",
          variable: "subject"},
        %{label: "Title",
          variable: "title"}
      ]
    },
    ...
  ]
```

The following table provides a description of the available keys and how to use them. An [example](#example) of their use is provided below.

Key | Options | Description
--- | --- | ---
filters: | [] List of %{} maps | This outer key encloses the list of all filters
label: | String | Human readable text, and what is rendered in browser as the filter label
variable: | A camel cased string with no spaces or special characters | The name field for the html form; also returned as a key to the catalog extension
format: | `"checkbox"`, `"radio"`, or `"slider_and_boxes"` | What type of input is rendered
entries: | `[]` List of `%{}` maps | A list of possible selection elements for the given filter. Each entry includes its own `label` and `variable` fields, as above. Entries can also include an `api_parameter`:
api_parameter | String | String that is passed into an api request parameter

**Note:** `slider_and_boxes` is a special format for dates that requires a couple different fields in the `entries` map:

Key | Options | Description
--- | --- | ---
min_variable: | A camel cased string with no spaces or special characters | The internal variable (key) for encoding a minimum date
max_variable: | A camel cased string with no spaces or special characters | The internal variable (key) for encoding a maximum date
min_value: | Integer | Minimum amount that is able to be passed into the form.
max_value: | Integer or function (`DateTime.utc_now().year`) that returns an integer | Maximum amount that is able to be passed into the form.

### Example

```elixir
config :sorin_search_filter,
  filters: [
    %{label: "Show:",
      variable: "show",
      format: "checkbox",
      entries: [
        %{label: "Peer Reviewed",
          variable: "peer_reviewed",
          api_parameter: "facet_tlevel,exact,peer_reviewed"},
        %{label: "Available in Library",
          variable: "available_in_library",
          api_parameter: "facet_tlevel,include,available"},
        %{label: "Presearch",
          variable: "presearch",
          api_parameter: "facet_rtype,exact,reference_entrys"}
      ]
     },
    %{label: "Search By:",
      variable: "search_by",
      format: "radio",
      entries: [
        %{label: "Any",
          variable: "any"},
        %{label: "Creator",
          variable: "creator"},
        %{label: "Subject",
          variable: "subject"},
        %{label: "Title",
          variable: "title"}
      ]
    },
    %{label: "Item Type:",
      variable: "item_type",
      format: "radio",
      entries: [
        %{label: "All",
          variable: "all",
          api_parameter: ""},
        %{label: "Books",
          variable: "books",
          api_parameter: "facet_rtype,exact,books"},
        %{label: "Articles",
          variable: "articles",
          api_parameter: "facet_rtype,exact,articles"},
        %{label: "Videos",
          variable: "videos",
          api_parameter: "facet_rtype,exact,videos"}
      ]
    },
    %{label: "Sort by:",
      variable: "sort_by",
      format: "radio",
      entries: [
        %{label: "Relevance",
          variable: "relevance"},
        %{label: "Date (newest)",
          variable: "date_newest"}
      ]
    },
    %{label: "Publish Date:",
      variable: "publish_date",
      format: "slider_and_boxes",
      entries: [
        %{label: "Years",
          min_variable: "min_date",
          max_variable: "max_date",
          min_value: 1000,
          max_value: DateTime.utc_now().year}
      ]
    }
  ]
```

