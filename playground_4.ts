// lets do some functional web scraping

// if we define a type we want to scrape, we could define a portion of that type as a monoid
// summing the monoid will give us the completed type

// type

import { applicative } from "fp-ts";
import { Monoid } from "fp-ts/lib/Monoid";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import cheerio from "cheerio";
import { BasicAcceptedElems } from "cheerio/lib/types";
import type { Node } from "domhandler";
import axios from "axios";
import { pipe } from "fp-ts/function";

interface BuildingProject {
  name: string;
  postCode: string;
  developer?: string;
  url: string;
}

interface BuildingProjects {
  projects: BuildingProject[];
}

const $ = cheerio.load("OOMGOMDOFM");

const scrapeFieldFunction = (context: string) => (selector: string) => {
  return O.of($(selector, context).text());
};

const fetch = async <T>(url: string) => {
  return axios
    .get<T>(url, {
      validateStatus: function (status) {
        return status === 200; //tell axios to throw if the response code is anything but OK
      },
      timeout: 2000,
    })
    .then((res) => {
      console.log(res.status);
      return res.data;
    })
    .catch((reason) => {
      throw new Error(`${reason}`);
    });
};

const axiosGet = TE.tryCatchK(fetch, (reason) => `${reason}`);

const scrapeUrl = (url: string) => {
  return pipe(
    axiosGet<string>(url),
    TE.map((rawHTML) => {
      return rawHTML;
    })
    /*  TE.chain(($) => TE.of($("a > div.grid").toArray())),
    TE.map((a) => a.map((v) => $(v).text())) */
  );
};

scrapeUrl(
  "https://medium.com/@masnun/handling-timeout-in-axios-479269d83c68"
)().then((d) =>
  pipe(
    d,
    E.fold(
      (e) => console.log(e),
      (a) => console.log(a.length)
    )
  )
);
``;
